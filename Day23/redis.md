# Redis Logout System — Complete Line-by-Line Explainer

---

## Step 1 — The Big Picture: Why This Problem Exists

When a user logs out, deleting the cookie on the browser side is easy. But the JWT token inside that cookie is still **cryptographically valid** on the server until it expires — maybe another hour.

```
User logs out → Cookie deleted in browser → Token still valid on server ⚠
```

> **The security hole:** Anyone who *copied* that cookie before logout can still make authenticated requests. That's what we're closing.

### The full solution flow

```
Login → Issue JWT + set cookie → Every request checks Redis → Logout adds token to blocklist
```

---

## Step 2 — `redis.js`: Connecting to Redis (node-redis + Redis Cloud)

This file creates **one shared Redis client** and exports it alongside a `connectRedis()` function that establishes the async TCP connection. Every other file imports this same pair — you never create a new connection per request.

```js
const redis = require("redis");

const redisClient = redis.createClient({
    username: 'default',
    password: 'abcdByE',
    socket: {
        host: 'redis-18991.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 18991
    }
});

const connectRedis = async () => {
    await redisClient.connect();
};

module.exports = { redisClient, connectRedis };
```

### Line-by-line

| Line | What it does |
|------|-------------|
| `require("redis")` | This is the **official `node-redis` v4+ package** (`npm install redis`), NOT `ioredis`. Both are Redis clients but have different APIs. The key difference: `node-redis` v4 requires an explicit `.connect()` call before use — ioredis connects lazily on first command. |
| `redis.createClient({...})` | Creates a client object, but **does NOT connect yet**. The socket stays closed until `connectRedis()` is called. This is a critical difference from ioredis. |
| `username: 'default'` | Redis Cloud (RedisLabs) requires authentication. `'default'` is the built-in Redis user — it has full access. Enterprise setups create named users with scoped permissions. |
| `password: 'abcdByE'` | The ACL password for the `default` user. In production, this should come from `process.env.REDIS_PASSWORD` — never hardcoded. |
| `socket: { host, port }` | `node-redis` v4 nests connection details inside a `socket` object — unlike ioredis which accepts `host`/`port` at the top level. The host here is a Redis Cloud instance hosted on AWS `ap-south-1` (Mumbai). |
| `port: 18991` | Redis Cloud assigns non-standard ports (default Redis is 6379). This port is unique to your Cloud instance — it's what distinguishes your DB from thousands of others on the shared infrastructure. |
| `connectRedis = async () => await redisClient.connect()` | This wrapper exists so you can `await` the connection during server startup. Without `await`, your app might try to run Redis commands before the TCP handshake completes, causing "client is closed" errors. |
| `module.exports = { redisClient, connectRedis }` | Named exports — both are needed in different places. `connectRedis` is called once at startup. `redisClient` is imported wherever commands are executed. |

> **Why not connect inside `createClient`?** `node-redis` v4 deliberately separated creation from connection to give you control over *when* the connection happens. This matters at startup — see Step 3.

---

## Step 3 — `start()`: Booting the Server Safely with `Promise.all`

This is where everything initializes. The key insight: MongoDB and Redis connections are **independent** — they don't need to wait for each other. Running them in parallel cuts startup time.

```js
const start = async () => {
  try {
    // Runs BOTH connections simultaneously — fails fast if either one fails
    await Promise.all([connectRedis(), main()]);

    console.log("Connected to Redis");
    console.log("Connected to Database");

    app.listen(process.env.PORT, () => {
      console.log("Listening at server 3000");
    });

  } catch (err) {
    console.log("Error: " + err.message);
  }
};
```

### Line-by-line

| Line | What it does |
|------|-------------|
| `Promise.all([connectRedis(), main()])` | Fires both async operations **simultaneously**. `connectRedis()` opens the TCP socket to Redis Cloud. `main()` connects to your database (MongoDB, Postgres, etc.). Neither waits for the other. |
| **Why `Promise.all` and not sequential `await`?** | Sequential: `await connectRedis()` takes ~150ms, then `await main()` takes ~200ms = 350ms total. Parallel: both run at once = ~200ms total. More importantly: if Redis fails, `Promise.all` rejects immediately and `catch` fires. You never start the HTTP server with a broken dependency. |
| `app.listen(...)` only runs **after** both resolve | This is the guarantee you want. The server never accepts requests before Redis and the DB are ready. Otherwise your first requests might hit `redisClient.get(...)` on a closed connection and crash. |
| `catch (err)` | If either promise rejects — wrong password, Redis Cloud down, DB connection refused — the error is caught here. The process doesn't start listening, preventing a broken server from silently running. |

### The startup sequence visualized

```
start() called
    │
    ├──► connectRedis()  ──────────────────────► TCP handshake with Redis Cloud
    │                                                       │
    └──► main()          ──────────► TCP handshake with DB  │
                                              │             │
                                              └──── both resolve ────► app.listen()
```

> **What happens if you call `redisClient.get()` before `connectRedis()`?** node-redis v4 throws: `"The client is closed"`. This is why `Promise.all` runs before `app.listen` — no route handler can fire until both connections are open.

---

## Step 4 — Importing the Client in Other Files

```js
const { redisClient, connectRedis } = require("./config/redis");
```

### Line-by-line

| Line | What it does |
|------|-------------|
| Destructured named import | You pull out exactly what you need. Route files usually only need `redisClient`. The startup file needs both. |
| `"./config/redis"` | This is a singleton pattern in Node.js. The first `require()` runs the module code and caches the result. Every subsequent `require("./config/redis")` anywhere in your app returns **the exact same `redisClient` object** — same TCP connection, same state. |
| Why this matters | If `authMiddleware` and your logout route both `require` this file, they share one connection — not two. Redis Cloud has connection limits; you don't want to exhaust them. |

---

## Step 5 — `POST /login`: Issuing the JWT and Cookie

When credentials are valid, we sign a JWT and put it inside an HttpOnly cookie. The browser stores this cookie and sends it automatically on every future request.

```js
const TOKEN_TTL = 60 * 60; // 1 hour in seconds

app.post('/login', (req, res) => {
  // ... validate credentials ...

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );

  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: TOKEN_TTL * 1000,
  });

  res.json({ message: 'Logged in' });
});
```

### Line-by-line

| Line | What it does |
|------|-------------|
| `jwt.sign()` | Creates a signed token. The payload `{ userId, email }` is embedded inside it. Anyone who receives this token can read the payload — but can't *forge* it without the secret. |
| `expiresIn: TOKEN_TTL` | Adds an `exp` claim to the JWT — a Unix timestamp = now + 3600 seconds. The middleware will reject it automatically after this time. |
| `httpOnly: true` | JavaScript running in the browser **cannot** read this cookie. Only the browser sends it. This prevents XSS attacks from stealing tokens. |
| `secure: true` | Browser only sends this cookie over HTTPS, never plain HTTP. |
| `sameSite: 'Strict'` | Browser won't send this cookie if the request originates from another website. Blocks CSRF attacks. |
| `maxAge: TOKEN_TTL * 1000` | Cookie expiry is in milliseconds, JWT `expiresIn` is in seconds. Both should match — so they expire at the same time. |

---

## Step 6 — `authMiddleware`: The Guard on Every Request

This runs **before** your route handlers on any protected route. It does three checks in order: cookie present → JWT valid → token not in Redis blocklist.

```js
async function authMiddleware(req, res, next) {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // node-redis v4 syntax — returns null if key doesn't exist
  const isBlocked = await redisClient.get(`blocklist:${token}`);
  if (isBlocked) {
    return res.status(401).json({ message: 'Token revoked' });
  }

  req.user = decoded;
  next();
}
```

### Line-by-line

| Line | What it does |
|------|-------------|
| `req.cookies?.authToken` | The `cookie-parser` middleware parses the Cookie header and puts all cookies on `req.cookies`. The `?.` prevents a crash if cookies is undefined. |
| `jwt.verify(token, JWT_SECRET)` | Does two things: verifies the signature (was this signed with our secret?) AND checks expiry. If either fails, it throws — we catch it and return 401. |
| `redisClient.get('blocklist:' + token)` | **node-redis v4 syntax**: returns the stored string value, or `null` if the key doesn't exist. Takes ~1ms over a local connection, ~15-30ms over Redis Cloud (network round trip to Mumbai). |
| `if (isBlocked)` | `null` is falsy → request proceeds. Any truthy string (like `'revoked'`) → 401. |
| `req.user = decoded` | We attach the decoded payload to the request object. Route handlers can now access `req.user.userId`, `req.user.email`, etc. |
| `next()` | Tells Express "this middleware is done, move to the next handler." Without this, the request hangs forever. Only call it when all checks pass. |

> **node-redis v4 vs ioredis difference here:** ioredis `.get()` also returns `null` for missing keys, so the `if (isBlocked)` logic is identical. The import path is the only difference.

### The three-check chain

```
Cookie present?
    ↓ No  → 401
    ↓ Yes
JWT signature valid + not expired?
    ↓ No  → 401
    ↓ Yes
Token in Redis blocklist?
    ↓ Yes → 401
    ↓ No
→ next() — request proceeds
```

---

## Step 7 — `POST /logout`: The Redis Blocklist Write

The core of the whole system. On logout we calculate exactly how long the token has left, then store it in Redis with that exact TTL. Redis auto-deletes it when the token would have expired anyway.

```js
app.post('/logout', async (req, res) => {
  const token = req.cookies?.authToken;

  if (token) {
    const decoded = jwt.decode(token);

    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000);
      const remainingTTL = decoded.exp - now;

      if (remainingTTL > 0) {
        // node-redis v4 syntax for SETEX
        await redisClient.set(
          `blocklist:${token}`,
          'revoked',
          { EX: remainingTTL }
        );
      }
    }
  }

  res.clearCookie('authToken', { httpOnly: true, secure: true });
  res.json({ message: 'Logged out' });
});
```

### ⚠️ Critical API Difference — `setex` vs `set` with `{ EX }`

This is where **node-redis v4 differs most visibly from ioredis**:

| Library | Syntax |
|---------|--------|
| **ioredis** | `redis.setex('key', ttlSeconds, 'value')` |
| **node-redis v4** | `redisClient.set('key', 'value', { EX: ttlSeconds })` |

Both issue the exact same `SETEX` command to Redis under the hood. The difference is purely in the JavaScript API.

### Line-by-line

| Line | What it does |
|------|-------------|
| `jwt.decode(token)` | **decode** just reads the payload without checking the signature. We use it here because we trust the cookie came from our own browser — we just need the `exp` timestamp to calculate TTL. |
| `Date.now() / 1000` | `Date.now()` gives milliseconds. JWT `exp` is in seconds. Dividing by 1000 and flooring converts them to the same unit so the subtraction works correctly. |
| `remainingTTL = decoded.exp - now` | How many seconds this token still has left. If the user logs out after 20 minutes of a 1-hour token, `remainingTTL = 2400`. |
| `redisClient.set(key, value, { EX: ttl })` | **node-redis v4 API**: The third argument is an options object. `EX` = expire in seconds, `PX` = expire in milliseconds, `EXAT` = expire at Unix timestamp. This sets the key and schedules Redis auto-deletion. |
| `'blocklist:' + token` | The colon is a Redis naming convention. Keys are just strings — the prefix groups related keys together visually and prevents collisions with other key types in the same DB. |
| `res.clearCookie('authToken', ...)` | Tells the browser to delete the cookie. The options must match **exactly** what was used when setting — `httpOnly`, `secure`, `sameSite` — otherwise the browser ignores the clear instruction. |

> **Key insight:** `jwt.decode()` vs `jwt.verify()` — at logout we don't need to re-verify the signature. We already trust this cookie (the user is logged in). We just need to read `exp` to calculate the TTL.

---

## Step 8 — Redis Internals: What's Actually Happening

Redis is an in-memory key-value store. Think of it as a giant dictionary that lives in RAM — on your Redis Cloud instance in Mumbai.

### What happens at each step

```
set() called on logout
    → Redis Cloud stores: key="blocklist:<token>", value="revoked", TTL=2400s

Request arrives with same token
    → redisClient.get('blocklist:<token>') returns 'revoked' → reject 401

2400 seconds pass
    → Redis Cloud auto-deletes the key. No action needed from your app.
```

### What the data looks like inside Redis

```
KEYS:
  blocklist:eyJhbGci...   → "revoked"  (TTL: 2400s)
  blocklist:eyJhbGci...   → "revoked"  (TTL: 180s)
  # ^ auto-deleted after TTL. Zero cleanup needed.
```

### Why not a database? Why not process RAM?

| Storage | Problem |
|---------|---------|
| Process RAM | Lost on server restart; doesn't work across multiple Node.js instances (horizontal scaling) |
| Database (SQL/Mongo) | 5–30ms per request + connection overhead + you need a cron job to delete expired tokens |
| **Redis Cloud** ✅ | ~15-30ms over network (still fast), built-in TTL auto-expiry, shared across all server instances |

> **Note on latency:** Running Redis locally gives ~0.5ms. Running on Redis Cloud (Mumbai) from your server adds ~10-25ms of network round-trip. For most apps this is fine. If latency is critical, host Redis in the same cloud region as your server.

---

## Step 9 — Protecting Routes with the Middleware

You attach the middleware to any route that requires authentication. Express runs it before your handler — if any check fails, the handler never runs.

```js
const authMiddleware = require('./middleware/auth');

// Protected — authMiddleware runs first
app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
});

// Public — no middleware
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Apply to all routes under /api at once
app.use('/api', authMiddleware);
```

### Express middleware chain

```
Request arrives
    ↓
cookie-parser (parse Cookie header into req.cookies)
    ↓
authMiddleware (3 checks: cookie → JWT → Redis blocklist)
    ↓
Your route handler (req.user is available here)
    ↓
Response sent
```

> If any step calls `return res.status(401).json(...)` without calling `next()`, the chain stops there. The handler never runs.

---

## Step 10 — Everything Together: End to End

```
1. Server starts
   await Promise.all([connectRedis(), main()])
   → TCP socket opened to Redis Cloud (Mumbai)
   → TCP socket opened to DB
   → app.listen() fires

2. POST /login
   Credentials valid
   → jwt.sign({ userId, email }, secret, { expiresIn: 3600 })
   → res.cookie('authToken', token, { httpOnly, secure, sameSite })
   → 200 OK

3. GET /dashboard  (legitimate request)
   Cookie sent automatically by browser
   → authMiddleware:
       cookie present? ✓
       jwt.verify() passes? ✓
       redisClient.get('blocklist:TOKEN') = null ✓
   → handler runs → 200 OK

4. POST /logout
   → jwt.decode(token) → read exp
   → now = Math.floor(Date.now() / 1000)
   → remainingTTL = exp - now  (e.g. 2400)
   → redisClient.set('blocklist:TOKEN', 'revoked', { EX: 2400 })
   → res.clearCookie('authToken')
   → 200 OK

5. Attacker uses copied cookie
   Cookie sent → authMiddleware:
       cookie present? ✓
       jwt.verify() passes? ✓  (token not expired yet)
       redisClient.get('blocklist:TOKEN') = 'revoked' ✗
   → 401 Unauthorized — BLOCKED ✅

6. 2400 seconds pass
   → Redis Cloud auto-deletes 'blocklist:TOKEN'
   → Token would have expired at the same time anyway
   → Zero cleanup needed
```

### The key insight

> **Redis TTL = JWT remaining lifetime.** The blocklist entry is never kept longer than necessary. Redis stays lean forever — no garbage accumulation, no cron job, no manual cleanup.

---

## Quick Reference

### Your file structure

```
project/
├── config/
│   └── redis.js              ← node-redis client + connectRedis()
├── middleware/
│   └── auth.js               ← authMiddleware (3-check guard)
└── routes/
    ├── auth.js               ← /login and /logout
    └── protected.js          ← your guarded routes
```

### Install dependencies

```bash
npm install express cookie-parser jsonwebtoken redis
# Note: "redis" not "ioredis" — these are different packages
```

### The 3 Redis operations in node-redis v4 syntax

| Operation | When | node-redis v4 syntax |
|-----------|------|----------------------|
| Store token with auto-expiry | On logout | `redisClient.set(key, 'revoked', { EX: ttlSeconds })` |
| Check if token is blocked | On every request | `redisClient.get(key)` → `null` or `'revoked'` |
| *(auto-delete)* | After TTL | Redis removes the key — nothing to do in your code |

### node-redis v4 vs ioredis cheat sheet

| Task | ioredis | node-redis v4 |
|------|---------|---------------|
| Connect | Auto on first command | `await client.connect()` |
| SET with expiry | `client.setex(k, ttl, v)` | `client.set(k, v, { EX: ttl })` |
| GET | `client.get(k)` | `client.get(k)` |
| DEL | `client.del(k)` | `client.del(k)` |
| Config host/port | Top-level `{ host, port }` | Nested `{ socket: { host, port } }` |

---

*Built with Node.js + Express + node-redis v4 + jsonwebtoken + Redis Cloud*

## Comparing Mongodb with Redis for better Understanding 

MONGOOSE                                          REDIS
──────────────────────────────────          ──────────────────────────────────

┌──────────────────────────────┐            ┌──────────────────────────────┐
│ mongoose.model("User",schema)│            │    redis.createClient()      │
└──────────────┬───────────────┘            └──────────────┬───────────────┘
               │                                           │
               ▼                                           ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│         User (Model)         │            │         redisClient          │
│       Model instance         │            │        Client instance       │
└──────────────┬───────────────┘            └──────────────┬───────────────┘
               │                                           │
               ▼                                           ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│           Methods            │            │           Methods            │
│ ───────────────────────────  │            │ ───────────────────────────  │
│  User.findById(id)           │            │  redisClient.set(key, val)   │
│  User.findOneAndDelete()     │            │  redisClient.get(key)        │
│  User.create(data)           │            │  redisClient.del(key)        │
└──────────────┬───────────────┘            └──────────────┬───────────────┘
               │                                           │
               ▼                                           ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│          MongoDB             │            │         Redis Server         │
│      Users collection        │            │       Key-Value Store        │
└──────────────────────────────┘            └──────────────────────────────┘


══════════════════════════════════════════════════════════════════════════════
                              Working Code
══════════════════════════════════════════════════════════════════════════════

         Mongoose — Setup + usage              Redis — Setup + usage
──────────────────────────────────          ──────────────────────────────────

  // 1. Define schema                         // 1. Create client
  const schema = new Schema({                 const client =
    name: String,                             redis.createClient();
    email: String
  });                                         // 2. Connect (required)
                                              await client.connect();
  // 2. Create model
  const User =                                // 3. Use it
  mongoose.model("User", schema);             await client.set(
                                              "token:abc", "blocked");
  // 3. Use it
  await User.create({                         const val =
    name: "Alice"                             await client.get("token:abc");
  });                                         // val === "blocked"

  const u =                                   // With expiry (auto-delete)
  await User.findById(id);                    await client.set(
                                              "token:abc",
  await User                                  "blocked",
  .findOneAndDelete(                          { EX: 3600 } // 1hr
  { _id: id }                                 );
  );
                                              await client.del("token:abc");
  // Schema-validated always                  // No schema — just key-value


══════════════════════════════════════════════════════════════════════════════
           Same concept — different database, different use case
══════════════════════════════════════════════════════════════════════════════