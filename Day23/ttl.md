Here's the markdown in the chat:

---

## TTL — Time To Live

**Time To Live** is a value that tells a system **how long something should exist** before it is automatically deleted or considered invalid.

It is not a Redis-specific concept — it appears everywhere:

| Where | What TTL means |
|---|---|
| Redis | How long before a key is auto-deleted |
| JWT | How long before a token is invalid (`exp - iat`) |
| DNS | How long a DNS record is cached |
| HTTP Cache | How long a browser caches a response |
| CDN | How long an edge server holds a file |

In every case the idea is the same — **"this thing has a limited lifetime, after which it dies automatically."**

---

## TTL in Redis — two ways to set it

---

### Way 1 — `setEx` (TTL as countdown)

You give Redis a **number of seconds to count down from now.**

```js
const now = Math.floor(Date.now() / 1000); // current time in seconds
const remainingTTL = decoded.exp - now;    // how many seconds left on the JWT

await redisClient.setEx('blocklist:token', remainingTTL, 'revoked');
// "start a countdown of 2400 seconds — delete when it hits zero"
```

Redis receives the number `2400` and starts counting down from that moment.

#### The problem

`Math.floor` rounds **down** — so `2400.87` becomes `2400`. You lose `0.87s` instantly.

Then the `setEx` command travels over the network to Redis Cloud — another `5–20ms` lost.

```
Real remaining life of JWT  →  2400.87 seconds
After Math.floor            →  2400 seconds      (-0.87s lost)
After network delay         →  ~2399.99 seconds  (-10ms more lost)

Redis deletes key at        →  T + 2400s
JWT actually expires at     →  T + 2400.87s

Gap = ~870ms where Redis key is gone but JWT is still valid
→ a copied token could slip through in this window
```

---

### Way 2 — `expireAt` (TTL as exact Unix timestamp)

You give Redis a **fixed point in time** to expire at — not a countdown.

```js
await redisClient.set('blocklist:token', 'revoked');
await redisClient.expireAt('blocklist:token', decoded.exp);
// "delete this key when your clock hits timestamp 1714803600"
```

`decoded.exp` is the exact Unix timestamp that was stamped into the JWT at login by `jwt.sign()`. It never changes. No math. No rounding.

Redis watches its own internal clock and deletes the key **the moment it hits that timestamp** — the exact same timestamp JWT uses to reject the token.

```
decoded.exp             →  1714803600  (fixed, stamped at login)
Redis expireAt          →  1714803600  (same number, handed directly)
JWT exp                 →  1714803600  (same number)

All three agree — perfect sync, zero drift
```

---

## Side by side

| | `setEx` (countdown) | `expireAt` (timestamp) |
|---|---|---|
| Full form | Set + Expiry in seconds | Expire At a Unix timestamp |
| You provide | Seconds remaining | Exact Unix timestamp |
| Math needed | Yes — `exp - now` | No — use `decoded.exp` directly |
| `Math.floor` rounding | Yes — loses fractional seconds | No rounding at all |
| Network drift | Yes — adds more lost time | Redis uses its own clock |
| Redis commands | 1 | 2 — `set` + `expireAt` |
| Sync with JWT expiry | Approximate | Exact |

---

## Which to use for logout blocklist

`expireAt` — always. Because:

- `decoded.exp` is the **same number** JWT uses to expire the token
- You hand that number directly to Redis — no subtraction, no rounding, no drift
- Redis and JWT die at the **exact same moment**
- No window exists where the key is gone but the token is still valid

```js
// Correct approach for logout
const decoded = jwt.decode(token);

await redisClient.set(`blocklist:${token}`, 'revoked');
await redisClient.expireAt(`blocklist:${token}`, decoded.exp);
```

---

> **One line summary:** TTL is how long something lives. `setEx` counts down from now with rounding errors. `expireAt` pins to an exact timestamp — the same one the JWT itself uses — so both expire in perfect sync.