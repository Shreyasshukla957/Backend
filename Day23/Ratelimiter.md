# Rate Limiter — Complete In-Depth Guide
### Redis Cloud + Node.js + Express

---

## Table of Contents

1. [What is a Rate Limiter?](#1-what-is-a-rate-limiter)
2. [Why Do We Need It?](#2-why-do-we-need-it)
3. [Redis Connection Setup](#3-redis-connection-setup)
4. [Token Bucket Algorithm](#4-token-bucket-algorithm)
5. [Fixed Window Algorithm](#5-fixed-window-algorithm)
6. [Sliding Window Algorithm](#6-sliding-window-algorithm)

---

## 1. What is a Rate Limiter?

A **Rate Limiter** is a traffic control mechanism that decides:
**"Should I allow this request or block it?"**
based on how many requests a client has already made in a given time window.

Think of it like a water tap — you can control the flow rate. Too much pressure and you shut it down.

### Simple Flow

```
Incoming Request
      |
      v
[ Rate Limiter Middleware ]
      |
   Check Redis
      |
  +---------+
  |         |
ALLOW      BLOCK
  |         |
  v         v
Next()    res.status(429).json({ error: "Too Many Requests" })
```

### Without Rate Limiter vs With Rate Limiter

```
WITHOUT:
User/Bot --> 10,000 req/sec --> Server --> CRASH / OVERLOAD

WITH:
User/Bot --> 10,000 req/sec --> [Rate Limiter] --> Only 100 allowed --> Server SAFE
                                               --> 9,900 blocked with 429
```

---

## 2. Why Do We Need It?

| Threat / Problem      | Without Rate Limiter         | With Rate Limiter              |
|-----------------------|------------------------------|--------------------------------|
| DDoS Attack           | Server goes down             | Requests blocked at middleware |
| Brute Force Login     | Password gets cracked        | Only N attempts allowed        |
| API Abuse             | Costs spike, server hangs    | Fair usage enforced            |
| One heavy user        | Others get slow responses    | Everyone gets equal bandwidth  |
| Web Scraping bots     | Your data gets stolen fast   | Slowed down significantly      |

---

## 3. Redis Connection Setup

You signed up on **redis.io** (Redis Cloud) and got a free hosted Redis instance.
You have a URL that looks like this:

```
redis://default:your_password@redis-12345.c1.us-east-1-2.ec2.redns.redis-cloud.com:12345
```

This is exactly like a MongoDB connection string. You just pass it to a client driver.
In Node.js, you need `ioredis` as the driver — same role as `mongoose` for MongoDB.

### Install

```bash
npm install ioredis dotenv express
```

### .env file

```
REDIS_URL=redis://default:your_password@your-redis-host.redis-cloud.com:PORT
```

### redis.js — The Connection File

```js
// redis.js

const Redis = require("ioredis");

// Exactly like mongoose.connect("mongodb://...") — just pass the URL
const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

module.exports = redis;
```

### server.js — Base Express Server

```js
// server.js

require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// rate limiter middlewares will be plugged in below (per section)

app.get("/test", (req, res) => {
  res.json({ message: "Request successful" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

> From here on, every algorithm uses this same `redis.js` and `server.js`.
> We just write a new middleware file and plug it into the route.

---

## 4. Token Bucket Algorithm

### The Concept

Imagine a **physical bucket** that holds tokens (coins, tickets — think of them as "permission slips").

```
Bucket Capacity = 10 tokens (maximum it can ever hold)

Time  | Tokens in Bucket | Request Comes In  | Result
------|-----------------|-------------------|--------
0s    | 10              | 1 request         | Allow, tokens = 9
1s    | 10 (refilled)   | 1 request         | Allow, tokens = 9
2s    | 9               | 5 requests burst  | Allow all 5, tokens = 4
3s    | 5 (refilled +1) | 8 requests burst  | Allow 5, block 3, tokens = 0
4s    | 1 (refilled)    | 1 request         | Allow, tokens = 0
```

### Rules of Token Bucket

```
1. Bucket starts full (e.g., 10 tokens)
2. Each request CONSUMES 1 token
3. Tokens REFILL at a fixed rate (e.g., 1 token/second, up to max capacity)
4. If bucket has tokens  --> ALLOW request
5. If bucket is empty    --> BLOCK request (429)
```

### Visual Bucket State

```
Full Bucket:
[ T  T  T  T  T  T  T  T  T  T ]  --> 10 tokens available

After 4 requests:
[ T  T  T  T  T  T  -  -  -  - ]  --> 6 tokens left

After 6 more requests:
[ -  -  -  -  -  -  -  -  -  - ]  --> 0 tokens, BLOCK next request

After 3 seconds of refill (1/sec):
[ T  T  T  -  -  -  -  -  -  - ]  --> 3 tokens back
```

### Why Token Bucket?

- Allows **burst traffic** (all 10 tokens can be spent instantly)
- Still **limits overall rate** via refill speed
- Very common in real APIs (GitHub API, AWS, Stripe)

---

### Token Bucket — Code

#### File: `middlewares/tokenBucket.js`

```js
// middlewares/tokenBucket.js

const redis = require("../redis");

/*
  CONFIGURATION:
  - BUCKET_CAPACITY : Maximum tokens the bucket can hold
  - REFILL_RATE     : How many tokens to add per interval
  - REFILL_INTERVAL : How often to refill (in seconds)
*/

const BUCKET_CAPACITY = 10;   // max 10 requests allowed in burst
const REFILL_RATE = 2;         // add 2 tokens every interval
const REFILL_INTERVAL = 10;    // every 10 seconds

const tokenBucketLimiter = async (req, res, next) => {
  // Step 1: Identify the client (use IP as the unique key)
  const clientIP = req.ip;
  const bucketKey = `token_bucket:${clientIP}`;

  // Step 2: Get current bucket state from Redis
  // We store two fields: "tokens" (current count) and "lastRefill" (last timestamp)
  const bucketData = await redis.hgetall(bucketKey);

  const now = Math.floor(Date.now() / 1000); // current time in seconds

  let tokens;
  let lastRefill;

  if (!bucketData || !bucketData.tokens) {
    // Step 3a: First time this client visits — create a full bucket
    tokens = BUCKET_CAPACITY;
    lastRefill = now;
  } else {
    // Step 3b: Existing client — load their current state
    tokens = parseFloat(bucketData.tokens);
    lastRefill = parseInt(bucketData.lastRefill);

    // Step 4: Calculate how many tokens to refill based on elapsed time
    //
    // How it works:
    // elapsed = how many seconds have passed since last refill
    // tokensToAdd = (elapsed / REFILL_INTERVAL) * REFILL_RATE
    //
    // Example:
    // elapsed = 20 seconds, REFILL_INTERVAL = 10, REFILL_RATE = 2
    // tokensToAdd = (20/10) * 2 = 4 tokens added

    const elapsed = now - lastRefill;
    const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL) * REFILL_RATE;

    if (tokensToAdd > 0) {
      // Add tokens but never exceed bucket capacity
      tokens = Math.min(BUCKET_CAPACITY, tokens + tokensToAdd);
      lastRefill = now; // reset refill timer
    }
  }

  // Step 5: Check if there's at least 1 token to consume
  if (tokens < 1) {
    // Bucket is empty — block the request
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "Token bucket is empty. Please wait before retrying.",
    });
  }

  // Step 6: Consume 1 token and save updated state back to Redis
  tokens -= 1;

  await redis.hset(bucketKey, "tokens", tokens, "lastRefill", lastRefill);

  // Step 7: Set an expiry so the Redis key auto-deletes if user goes inactive
  // Set TTL = REFILL_INTERVAL * (BUCKET_CAPACITY / REFILL_RATE) = max time to fully refill
  await redis.expire(bucketKey, REFILL_INTERVAL * (BUCKET_CAPACITY / REFILL_RATE));

  // Step 8: Attach info to response headers (optional but useful for clients)
  res.set("X-RateLimit-Tokens-Remaining", tokens);

  // Step 9: Allow request to proceed
  next();
};

module.exports = tokenBucketLimiter;
```

#### Plugging into server.js

```js
// server.js (add this)

const tokenBucketLimiter = require("./middlewares/tokenBucket");

// Apply only to this route
app.get("/api/data", tokenBucketLimiter, (req, res) => {
  res.json({ message: "Data fetched successfully" });
});

// Or apply globally to all routes
app.use(tokenBucketLimiter);
```

### What Happens in Redis for Token Bucket

```
Key:   token_bucket:192.168.1.1
Type:  Hash
Fields:
  tokens     --> 7       (current token count)
  lastRefill --> 1718000 (unix timestamp of last refill)

After 10 seconds pass and 0 requests:
  tokens     --> 9       (7 + 2 new tokens, capped at 10)
  lastRefill --> 1718010
```

---

## 5. Fixed Window Algorithm

### The Concept

Divide time into **fixed blocks** (windows). Count requests inside that block.
When the block resets, the counter resets.

```
Window size = 60 seconds, Max = 5 requests

Timeline:
|--- 0s to 60s (Window 1) ---|--- 60s to 120s (Window 2) ---|

Window 1:
  - req at 5s  --> count=1, ALLOW
  - req at 20s --> count=2, ALLOW
  - req at 35s --> count=3, ALLOW
  - req at 40s --> count=4, ALLOW
  - req at 55s --> count=5, ALLOW
  - req at 58s --> count=6, BLOCK (limit hit)
  - req at 59s --> count=7, BLOCK (limit hit)

Window 2 starts at 60s:
  - req at 61s --> count=1, ALLOW  (counter RESET)
  - req at 62s --> count=2, ALLOW
```

### Visual Timeline

```
0s -------- 60s -------- 120s -------- 180s
|  Window1  |  Window2   |  Window3    |
|  [5 req]  |  [5 req]   |  [5 req]    |
|  BLOCKED  |  RESET     |  RESET      |
     ^60s        ^60s
  counter     counter
  resets      resets
```

### The Problem with Fixed Window (Edge Case)

```
Window ends at 60s, new one starts at 60s

User sends:
  - 5 requests at 59s  --> all allowed (end of Window 1)
  - 5 requests at 61s  --> all allowed (start of Window 2)

Result: 10 requests in just 2 seconds — that's a burst spike!
```

This is fixed window's **known weakness**. Sliding window solves this.

---

### Fixed Window — Code

#### File: `middlewares/fixedWindow.js`

```js
// middlewares/fixedWindow.js

const redis = require("../redis");

/*
  CONFIGURATION:
  - WINDOW_SIZE  : Duration of each window in seconds
  - MAX_REQUESTS : Maximum requests allowed per window
*/

const WINDOW_SIZE = 60;    // 60 second window
const MAX_REQUESTS = 10;   // max 10 requests per window

const fixedWindowLimiter = async (req, res, next) => {
  // Step 1: Identify client
  const clientIP = req.ip;

  // Step 2: Build the Redis key
  //
  // The trick here is the KEY NAME includes the current window's timestamp.
  // We calculate which "window slot" the current time falls into:
  //
  // windowStart = Math.floor(now / WINDOW_SIZE) * WINDOW_SIZE
  //
  // Example (WINDOW_SIZE = 60):
  //   now = 1718000045  --> windowStart = floor(1718000045/60)*60 = 1718000040
  //   now = 1718000090  --> windowStart = floor(1718000090/60)*60 = 1718000080 (new window)
  //
  // This means everyone in the same 60s block shares the same key,
  // and after 60s the key changes — effectively resetting the counter.

  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / WINDOW_SIZE) * WINDOW_SIZE;
  const windowKey = `fixed_window:${clientIP}:${windowStart}`;

  // Step 3: Increment the request counter in Redis
  // INCR creates the key with value 1 if it doesn't exist, or adds 1 to existing
  const requestCount = await redis.incr(windowKey);

  // Step 4: On first request in this window, set the TTL
  // We set expiry = WINDOW_SIZE + small buffer so Redis auto-cleans old keys
  if (requestCount === 1) {
    await redis.expire(windowKey, WINDOW_SIZE + 5);
  }

  // Step 5: Calculate how many seconds remain in current window
  const secondsElapsed = now - windowStart;
  const secondsRemaining = WINDOW_SIZE - secondsElapsed;

  // Step 6: Add informative headers for the client
  res.set("X-RateLimit-Limit", MAX_REQUESTS);
  res.set("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - requestCount));
  res.set("X-RateLimit-Reset", secondsRemaining);

  // Step 7: Check if limit is exceeded
  if (requestCount > MAX_REQUESTS) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: `Too many requests. Limit resets in ${secondsRemaining} seconds.`,
      retryAfter: secondsRemaining,
    });
  }

  // Step 8: Allow the request
  next();
};

module.exports = fixedWindowLimiter;
```

#### Plugging into server.js

```js
// server.js (add this)

const fixedWindowLimiter = require("./middlewares/fixedWindow");

app.get("/api/search", fixedWindowLimiter, (req, res) => {
  res.json({ message: "Search results returned" });
});
```

### What Happens in Redis for Fixed Window

```
Request at 14:00:05 (window = 14:00:00):
  Key:   fixed_window:192.168.1.1:1718000000
  Value: 1
  TTL:   65 seconds

Request at 14:00:30 (same window):
  Key:   fixed_window:192.168.1.1:1718000000
  Value: 2
  TTL:   35 seconds (counting down)

Request at 14:01:05 (NEW window = 14:01:00):
  Key:   fixed_window:192.168.1.1:1718000060  <-- NEW KEY, counter resets
  Value: 1
  TTL:   65 seconds
```

---

## 6. Sliding Window Algorithm

### The Concept

Instead of hard-cut time blocks, use a **rolling window** that continuously slides forward with time.

At any given moment, count requests that happened in the **last N seconds**.

```
MAX = 5 requests per 60 seconds (sliding)

Timeline (current time = 70s):

Look back from 70s to 10s (last 60 seconds):
  req at 15s  --> inside window, COUNT
  req at 30s  --> inside window, COUNT
  req at 50s  --> inside window, COUNT
  req at 65s  --> inside window, COUNT
  req at 5s   --> OUTSIDE window (70 - 5 = 65s ago), IGNORE

Count = 4, under limit, ALLOW
```

### Sliding vs Fixed — The Edge Case Fixed

```
FIXED WINDOW problem:
  - 5 requests at 59s (Window 1 end)  --> ALLOWED
  - 5 requests at 61s (Window 2 start) --> ALLOWED
  = 10 requests in 2 seconds  PROBLEM

SLIDING WINDOW:
  - 5 requests at 59s --> ALLOWED
  - Request at 61s --> looks back 60s (to 1s) --> sees 5 requests from 59s --> BLOCKED
  = Max 5 requests in any 60s window  SAFE
```

### Visual Sliding Window

```
Time: 0 ----10----20----30----40----50----60----70----80
Reqs:      R1   R2         R3    R4              R5

At t=70, window is [10s to 70s]:
  R1(10s) - IN
  R2(20s) - IN
  R3(40s) - IN
  R4(50s) - IN
  Count = 4, allow R5

At t=80, window is [20s to 80s]:
  R1(10s) - OUT (expired from window)
  R2(20s) - IN (just on edge)
  R3(40s) - IN
  R4(50s) - IN
  R5(80s) - IN (just added)
  Count = 4, ALLOW next
```

### How We Implement This in Redis

We use a **Redis Sorted Set (ZSET)**.

```
Each request is stored as:
  member: unique ID (timestamp in ms)
  score:  timestamp in seconds (for range queries)

To count requests in last 60 seconds:
  ZCOUNT key (now - 60) now

To remove old requests:
  ZREMRANGEBYSCORE key 0 (now - 60)
```

---

### Sliding Window — Code

#### File: `middlewares/slidingWindow.js`

```js
// middlewares/slidingWindow.js

const redis = require("../redis");

/*
  CONFIGURATION:
  - WINDOW_SIZE  : How far back to look (in seconds)
  - MAX_REQUESTS : Max requests allowed in that window
*/

const WINDOW_SIZE = 60;    // look back 60 seconds
const MAX_REQUESTS = 10;   // max 10 requests in any 60s period

const slidingWindowLimiter = async (req, res, next) => {
  // Step 1: Identify the client
  const clientIP = req.ip;
  const windowKey = `sliding_window:${clientIP}`;

  // Step 2: Get current timestamp in milliseconds (used as unique member ID)
  // We use ms precision so two near-simultaneous requests don't collide as same member
  const nowMs = Date.now();           // e.g., 1718000000123
  const nowSec = nowMs / 1000;        // e.g., 1718000000.123 (used as score)
  const windowStart = nowSec - WINDOW_SIZE; // look back from here

  // Step 3: Remove all entries older than the window
  //
  // ZREMRANGEBYSCORE removes all members with score between min and max.
  // Score = timestamp in seconds.
  // So we delete everything before (now - 60 seconds).
  //
  // Example:
  //   now = 1718000070
  //   windowStart = 1718000070 - 60 = 1718000010
  //   Remove all entries with score < 1718000010 (older than 60s)

  await redis.zremrangebyscore(windowKey, 0, windowStart);

  // Step 4: Count how many requests exist in the current window
  //
  // ZCOUNT counts members with score between min and max.
  // We count from windowStart to now (last 60 seconds).

  const requestCount = await redis.zcount(windowKey, windowStart, nowSec);

  // Step 5: Check if already at limit
  if (requestCount >= MAX_REQUESTS) {
    // Find the oldest entry's score to tell client when they can retry
    // ZRANGE returns members in ascending score order, index 0 is oldest
    const oldest = await redis.zrange(windowKey, 0, 0, "WITHSCORES");
    const oldestTime = oldest.length >= 2 ? parseFloat(oldest[1]) : nowSec;
    const retryAfter = Math.ceil(oldestTime + WINDOW_SIZE - nowSec);

    return res.status(429).json({
      error: "Rate limit exceeded",
      message: `Too many requests. Try again in ${retryAfter} seconds.`,
      retryAfter: retryAfter,
    });
  }

  // Step 6: Add current request to the sorted set
  //
  // ZADD key score member
  // score = current timestamp in seconds (used for range removal)
  // member = timestamp in ms (unique ID for this request)
  //
  // Why ms for member and seconds for score?
  // - ms ensures uniqueness even for rapid-fire requests
  // - seconds as score makes the ZREMRANGEBYSCORE math clean

  await redis.zadd(windowKey, nowSec, nowMs.toString());

  // Step 7: Set TTL on the key so it auto-deletes after inactivity
  await redis.expire(windowKey, WINDOW_SIZE + 5);

  // Step 8: Add headers
  res.set("X-RateLimit-Limit", MAX_REQUESTS);
  res.set("X-RateLimit-Remaining", MAX_REQUESTS - requestCount - 1);

  // Step 9: Allow request
  next();
};

module.exports = slidingWindowLimiter;
```

#### Plugging into server.js

```js
// server.js (add this)

const slidingWindowLimiter = require("./middlewares/slidingWindow");

app.get("/api/messages", slidingWindowLimiter, (req, res) => {
  res.json({ message: "Messages fetched" });
});
```

### What Happens in Redis for Sliding Window

```
Key:   sliding_window:192.168.1.1
Type:  Sorted Set (ZSET)

After 4 requests at different times:
  Member (unique ms ID)  |  Score (timestamp s)
  1718000010000          |  1718000010.000
  1718000020000          |  1718000020.000
  1718000040000          |  1718000040.000
  1718000050000          |  1718000050.000

At t=1718000075, window = [1718000015 to 1718000075]:
  1718000010000 --> score 1718000010 < 1718000015 --> REMOVED
  Remaining count = 3, request ALLOWED
```

---

## Final Comparison

```
Algorithm      | Burst Allowed | Memory Use | Accuracy   | Complexity
---------------|---------------|------------|------------|----------
Token Bucket   | YES           | Low        | Good       | Medium
Fixed Window   | YES (edge)    | Very Low   | Moderate   | Low
Sliding Window | NO burst edge | Medium     | Best       | Medium
```

### When to Use What

```
Token Bucket   --> APIs that need to allow occasional bursts (uploads, search)
Fixed Window   --> Simple counters, internal admin tools, low-stakes limits
Sliding Window --> Login attempts, OTP, payment APIs, any security-critical limit
```

---

## Full Project Structure

```
project/
├── .env
├── server.js
├── redis.js
└── middlewares/
    ├── tokenBucket.js
    ├── fixedWindow.js
    └── slidingWindow.js
```

---

*All three algorithms use the same `redis.js` connection file.*
*Swap the middleware on any route depending on what behaviour you need.*