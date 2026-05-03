**Q&A: JWT, Cookies, Token Expiry, Redis — Poora Session (Detailed)**

---

## Section 1: Cookie Aur Logout Ka Basic Kaam

---

**Q: Agar main logged in hoon aur token delete kar doon toh logout hoga ya code likhna padega?**

Cookie delete karte hi effectively logged out ho jaate ho — koi extra code nahi chahiye basic logout ke liye. Reason yeh hai ki server ke paas koi "memory" nahi hoti ki kaun logged in hai. Server ka kaam sirf itna hai:

```
Request aayi → cookie mein token hai? → verify karo → allow ya reject
```

Toh jab cookie hi nahi hai, token verify karne ko kuch hai hi nahi — server automatically reject kar dega.

Bas yeh ensure karo ki teri protected routes mein authentication middleware laga ho:

```javascript
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Not authenticated");
  const decoded = jwt.verify(token, "your_secret_key");
  req.user = decoded;
  next();
};

app.get("/profile", authenticate, (req, res) => {
  res.send("Protected data");
});
```

Middleware nahi laga toh cookie delete karne ke baad bhi route accessible rahega — isliye middleware lagana mandatory hai.

---

**Q: Yeh stateless kya hota hai exactly aur iska cookie se kya connection hai?**

Stateless ka matlab hai server ko koi bhi information store nahi karni client ke baare mein. Har request apne aap mein complete hoti hai:

```
Traditional (Stateful) Session:
User login kiya → server memory mein likha "User 123 logged in"
Har request → server apni memory check karta hai
User logout → server memory se hata diya

JWT (Stateless):
User login kiya → server ne sirf token diya, khud kuch store nahi kiya
Har request → server token verify karta hai (math se, memory se nahi)
User logout → server ke paas hatane ko kuch hai hi nahi
```

Isliye cookie itni important hai — token client ke paas rehta hai (browser mein cookie mein), server ke paas nahi. Har request mein client khud token bhejta hai, server verify karta hai aur kaam karta hai.

---

**Q: Toh internally exactly kya hota hai har request pe?**

```
1. Tum kuch click karte ho (e.g., "View Profile")
2. Browser ek HTTP request banata hai
3. Browser apne aap us request mein cookies add kar deta hai
   GET /profile
   Cookie: token=eyJhbGci...
4. Request server pe pahunchi
5. authenticate middleware chala
6. req.cookies.token se token nikala
7. jwt.verify() se token verify kiya
   - Signature check ki (tampered toh nahi?)
   - Expiry check ki (purana toh nahi?)
8. Sab sahi → req.user mein data daal ke next() call kiya
9. Route handler chala → response bheja
10. Connection close ho gayi
```

Step 10 ke baad server completely bhool jaata hai ki yeh request aayi thi. Koi state nahi, koi memory nahi.

---

**Q: Agar See Posts pe hoon aur beech mein cookie delete karoon toh?**

Jo page already load ho chuka hai woh browser mein HTML/CSS/JS ke roop mein stored hai — server se koi connection nahi:

```
Timeline:
5:00 PM → /posts request gayi → server ne token verify kiya → posts ka HTML bheja → connection close
5:01 PM → tum posts dekh rahe ho (sirf browser mein, server involve nahi)
5:02 PM → cookie delete ki
5:03 PM → ab bhi posts dekh sakte ho (browser mein jo hai woh hai)
5:04 PM → View Profile click kiya → naya request → cookie nahi → 401 reject ❌
```

Restaurant analogy:
```
Server = kitchen
Browser = tumhari dining table
Jo khana table pe aa gaya → tum kha sakte ho, cook wapas nahi aata
Naya order doge → cook membership card maangega → nahi hai → nahi milega
```

---

**Q: Kya logout button ke liye code likhna padta hai?**

Technically nahi chahiye — cookie delete karna kaafi hai. But app mein ek clean logout route hona chahiye taaki frontend se ek click mein ho sake:

```javascript
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token"); // browser ki cookie clear karo
  res.send("Logged out successfully");
});
```

`clearCookie` kya karta hai internally:
```
Browser ko ek response bhejta hai jisme Set-Cookie header hota hai
Set-Cookie: token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/
Browser yeh dekh ke cookie delete kar deta hai
```
Past date set kar ke cookie delete karwa dete hain — yeh standard HTTP technique hai.

---

## Section 2: Instant Logout Implementation

---

**Q: Kya koi instantly logout implement kar sakta hai — jaise hi cookie delete ho?**

Haan, periodic token check se:

```javascript
// Frontend pe yeh code daalo
setInterval(async () => {
  try {
    const res = await fetch("/check-auth", { credentials: "include" });
    if (res.status === 401) {
      window.location.href = "/login"; // cookie gayi → redirect
    }
  } catch(err) {
    window.location.href = "/login"; // network error bhi = logout
  }
}, 5000); // har 5 second mein check
```

Server pe:
```javascript
authRouter.get("/check-auth", authenticate, (req, res) => {
  res.status(200).send("OK");
  // authenticate middleware handle karta hai 401
});
```

Flow:
```
5:00:00 → check → token hai → OK
5:00:05 → check → token hai → OK
5:00:07 → cookie delete ki
5:00:10 → check → token nahi → 401 → redirect to /login ✅
```

---

**Q: Par har 5 second mein request karna server pe zyada burden nahi dalega?**

Bilkul dalega — yeh ek real problem hai:

```
100 users   × 1 req/5sec = 20 req/sec   → manageable
1,000 users × 1 req/5sec = 200 req/sec  → thoda heavy
10,000 users × 1 req/5sec = 2000 req/sec → bahut heavy, sirf auth check ke liye!
```

**Better approaches:**

*1. Sirf user activity pe check karo:*
```javascript
// User kuch kar raha hai tabhi check karo
let lastCheck = 0;
const CHECK_INTERVAL = 30000; // 30 seconds

async function checkAuth() {
  const now = Date.now();
  if (now - lastCheck < CHECK_INTERVAL) return; // 30 sec se pehle check mat karo
  lastCheck = now;
  const res = await fetch("/check-auth", { credentials: "include" });
  if (res.status === 401) window.location.href = "/login";
}

document.addEventListener("click", checkAuth);
document.addEventListener("keypress", checkAuth);
// Sirf tab check hoga jab user actually kuch kar raha ho
```

*2. WebSockets — sabse efficient:*
```javascript
// Ek baar connect karo, server push karega logout event
const ws = new WebSocket("ws://localhost:3000");
ws.onmessage = (event) => {
  if (event.data === "LOGOUT") window.location.href = "/login";
};
// Server detect karta hai invalid token → pushes "LOGOUT" → done
// Koi polling nahi, koi repeated requests nahi
```

*3. Longer interval:*
```javascript
setInterval(checkAuth, 5 * 60 * 1000); // 5 minute mein ek baar = 95% kam requests
```

Practically zyaatar apps ke liye: token expiry + next-request-rejection kaafi hota hai. Real-time instant logout sirf banking, medical, ya high-security apps mein zaroori hai.

---

## Section 3: Date, Expires Aur Milliseconds

---

**Q: `expires: new Date(Date.now())` — yeh teeno cheezein kya hain?**

Teeno bilkul alag cheezein hain:

```javascript
{ expires: new Date(Date.now() + 3600000) }
```

`Date.now()` — ek static method hai jo current time ko milliseconds mein return karta hai as a plain number:
```javascript
Date.now() // → 1714900000000 (plain number, type: "number")
```

`new Date()` — ek class ka constructor hai jo number ko Date object mein convert karta hai:
```javascript
new Date(1714900000000) // → Sat May 02 2026 17:00:00 (type: "object")
```

`expires` — options object ki ek key hai, na function na class. Sirf Express ko batata hai ki cookie kab delete karni hai.

---

**Q: `3600000` kyun specifically?**

```
1 millisecond = 0.001 seconds
1 second      = 1,000 milliseconds
1 minute      = 60 seconds      = 60 × 1,000        =        60,000 ms
1 hour        = 60 minutes      = 60 × 60 × 1,000   =     3,600,000 ms
1 day         = 24 hours        = 24 × 60 × 60 × 1,000 = 86,400,000 ms
```

Isliye commonly aise likhte hain jo zyada readable ho:
```javascript
const ONE_HOUR  = 60 * 60 * 1000;        // 3,600,000
const ONE_DAY   = 24 * 60 * 60 * 1000;   // 86,400,000
const ONE_WEEK  = 7 * 24 * 60 * 60 * 1000; // 604,800,000

res.cookie("token", token, { expires: new Date(Date.now() + ONE_DAY) });
```

---

**Q: Agar `+ 3600000` nahi likha toh?**

```javascript
{ expires: new Date(Date.now()) }
// expires = abhi ka time = cookie set hote hi expire ho jaati hai
```

Yeh actually logout ka ek tarika hai:
```javascript
// logout route mein
res.cookie("token", "", { expires: new Date(Date.now()) });
// ya simply
res.clearCookie("token"); // yeh internally same kaam karta hai
```

---

**Q: `{ expires: Date.now() }` — yeh outer object toh hai, phir kaam kyun nahi karta?**

Yeh confusion common hai. Outer `{}` object zaroori hai, but Express `expires` ki **value ka type** check karta hai, outer object ka nahi:

```javascript
// Express ka internal code kuch aisa kaam karta hai:
if (options.expires instanceof Date) {
  // ✅ Date object hai → process karo
  header += "; Expires=" + options.expires.toUTCString();
} else {
  // ❌ number/string/kuch bhi aur → ignore kar dega ya error
}
```

```javascript
{ expires: Date.now() }        // expires ki value = 1714900000000 (number) ❌
{ expires: new Date(Date.now()) } // expires ki value = Date object ✅
```

Bilkul aise:
```javascript
const person = { age: "25" }
// person object hai ✅
// but age ki value string hai, number nahi
// person object hone se age ki value number nahi ban jaati
```

---

**Q: Internally milliseconds store hote hain ya human readable format?**

Hamesha milliseconds — human readable format sirf display ke liye hai:

```javascript
console.log(Date.now())              // 1714900000000  ← yeh store hota hai
console.log(new Date(Date.now()))    // Sat May 02 2026 17:00:00 ← sirf display

// Dono same value hain, alag format mein
```

Browser cookie expiry check karta hai:
```
Current time (ms) > Expiry time (ms)?
Haan → cookie delete karo
Nahi → cookie rakho
```

`5:00 PM` wala format DevTools mein dikhta hai readability ke liye, andar sab milliseconds ka khelh hai.

---

## Section 4: Token Blocklist — Poora Journey

---

**Q: Token blocklist ki zaroorat kyun padi — basic cookie deletion kaafi nahi thi?**

JWT stateless hai — server track nahi karta ki kaun logged in hai. Iska ek serious problem hai:

```
Step 1: Attacker tere session mein hai (public WiFi, XSS, kuch bhi)
Step 2: Attacker ne tera token copy kar liya
Step 3: Tu logout kar leta hai (cookie delete)
Step 4: Teri cookie gayi — tu logged out ✅
Step 5: Attacker copied token use karta hai
Step 6: Server check karta hai → valid signature ✅ → expiry theek hai ✅ → allow ✅
Step 7: Attacker teri account access kar raha hai bina teri jaankari ke ❌
```

Server ko pata hi nahi ki token "stolen" hai — uske paas check karne ka koi zariya nahi tha. Yahi problem solve karne ke liye blocklist ka concept aaya.

---

**Q: Pehla solution kya socha developers ne?**

Sabse seedha soch: token ko user ke saath hi DB mein store karo:

```javascript
// User Schema mein ek field add kiya
{
  name: "Shreyash",
  email: "s@gmail.com",
  password: "hashed...",
  token: null  // ← naya field
}

// Login pe
const token = jwt.sign({ id: user._id }, SECRET);
await User.findByIdAndUpdate(user._id, { token: token });
res.cookie("token", token);

// Logout pe
await User.findByIdAndUpdate(user._id, { token: null });
res.clearCookie("token");

// Har request pe (middleware mein)
const user = await User.findOne({ token: req.cookies.token });
if (!user) throw new Error("Invalid token");
// DB mein token null hai = user logged out = reject ✅
```

Attacker scenario ab:
```
Attacker ne token copy kiya → user logout → DB mein null
Attacker use karta hai → DB mein dhundha → null mila → reject ✅
```

Kaam karta hai! But ek nayi problem aayi...

**Problem: Single device only**
```
User phone pe login kiya  → token "AAA" DB mein save
User laptop pe login kiya → token "BBB" DB mein save (AAA overwrite!)
Phone pe request → token "AAA" → DB mein "BBB" hai → reject ❌
```
Multiple devices support nahi tha.

---

**Q: Multiple devices ke liye kya kiya?**

Token array approach — ek token ki jagah array of tokens:

```javascript
// User Schema
{
  name: "Shreyash",
  tokens: [
    { token: "eyJ...phone..." },    // phone ka token
    { token: "eyJ...laptop..." },   // laptop ka token
    { token: "eyJ...tablet..." },   // tablet ka token
  ]
}

// Login pe — array mein push karo
const token = jwt.sign({ id: user._id }, SECRET);
user.tokens.push({ token: token });
await user.save();

// Logout (sirf is device ka) — filter se remove karo
user.tokens = user.tokens.filter(t => t.token !== req.cookies.token);
await user.save();

// Logout all devices — poora array saaf
user.tokens = [];
await user.save();

// Har request pe check
const user = await User.findOne({ "tokens.token": req.cookies.token });
if (!user) throw new Error("Invalid token");
```

Yeh approach bahut popular hai aur MongoDB projects mein aaj bhi use hoti hai. But ek aur problem:

```
10 million users
Har user ke average 3-4 active tokens
= 30-40 million tokens DB mein stored
= User document bahut bada ho gaya
= DB queries slow ho gayi
```

---

**Q: Toh blocklist approach kyun better hai?**

Seedhi soch: valid tokens track karne ki jagah **sirf invalid tokens track karo**:

```
Pehle approach: "Kaun valid hai" track karo → sabke tokens store karo
Blocklist approach: "Kaun invalid hai" track karo → sirf logout wale tokens store karo
```

Zyaatar users logged in rehte hain — logout tokens bahut kam hote hain valid tokens se. Toh blocklist mein bahut kam data hoga:

```javascript
// Alag Blocklist model banao
const blocklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  blockedAt: { type: Date, default: Date.now }
});
const Blocklist = mongoose.model("Blocklist", blocklistSchema);

// Logout pe — blocklist mein add karo
authRouter.post("/logout", async (req, res) => {
  const token = req.cookies.token;
  await Blocklist.create({ token: token });
  res.clearCookie("token");
  res.send("Logged out Successfully");
});

// Har request pe — blocklist check karo
const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw new Error("No token");

  const isBlocked = await Blocklist.findOne({ token: token });
  if (isBlocked) throw new Error("Token is invalid, please login again");

  const decoded = jwt.verify(token, SECRET);
  req.user = decoded;
  next();
};
```

Attacker scenario ab:
```
Attacker ne token copy kiya
User logout kiya → token blocklist mein add hua
Attacker use karta hai → blocklist mein mila → reject ✅
User wapas login kiya → naya token (alag iat) → blocklist mein nahi → allow ✅
```

---

**Q: Blocklist mein bhi problem hai — size badhti rahegi?**

Bilkul sahi! Har logout ek entry add karta hai — kabhi delete nahi hoti toh blocklist infinitely badhegi.

**Solution: TTL Index (Time To Live)**

```javascript
const blocklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600  // ← MongoDB automatically delete karega 1 hour baad
  }
});
```

TTL index kaise kaam karta hai:
```
Token block hua 5:00 PM pe
createdAt = 5:00 PM
expires = 3600 seconds = 1 hour
6:00 PM pe MongoDB khud woh document delete kar deta hai ✅
```

`3600` seconds kyun? Kyunki token waise bhi 1 hour mein expire ho jaata hai (`expiresIn: "1h"`). Uske baad blocklist mein rakhne ka koi fayda nahi — JWT verify hi fail kar dega expiry ki wajah se:

```
Token expire ho gaya → jwt.verify() throw karega "jwt expired"
Blocklist check karne ki zaroorat hi nahi ✅
```

Toh blocklist ki size hamesha manageable rehti hai — sirf active-but-logged-out tokens hote hain.

---

## Section 5: IAT Aur Token Uniqueness

---

**Q: Same credentials se dobara login karein toh same token banega — toh blocked rahega?**

Nahi banega same token! JWT mein ek hidden field automatically add hoti hai — `iat` (issued at):

```javascript
// Tu yeh likhta hai:
jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });

// JWT internally yeh banata hai:
{
  id: "507f1f77bcf86cd799439011",
  iat: 1714900000,   // ← issued at — exactly kab bana (Unix timestamp in seconds)
  exp: 1714903600    // ← expiry = iat + 3600
}
```

Toh:
```
Pehli baar login: 5:00:00 PM → iat: 1714900000
Doosri baar login: 5:30:00 PM → iat: 1714901800  ← alag!
```

Hashing ka fundamental rule — ek bhi bit alag = poora output completely alag:
```
Hash("hello")  → "abc123def456"
Hash("hellp")  → "xyz789qrs012"  ← sirf ek letter alag, poora hash different
```

Toh:
```
Token 1: Hash({id:"123", iat:1714900000} + secret) = "eyJ...AAAA"  ← blocklist mein
Token 2: Hash({id:"123", iat:1714901800} + secret) = "eyJ...BBBB"  ← valid ✅
```

Completely alag tokens — same credentials ke bawajood.

---

**Q: `iat` ka sirf yahi ek kaam hai uniqueness ka?**

Nahi, `iat` ke kai important uses hain:

*1. Uniqueness (jo abhi dekha)* — har login pe alag token.

*2. Token age check — force re-login after X time:*
```javascript
const authenticate = (req, res, next) => {
  const decoded = jwt.verify(token, SECRET);

  // iat seconds mein hota hai, isliye * 1000 for ms
  const tokenAgeMs = Date.now() - (decoded.iat * 1000);
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  if (tokenAgeMs > MAX_AGE) {
    throw new Error("Token too old, please login again");
  }
  next();
};
```

*3. Password change ke baad purane tokens automatically invalidate karo:*
```javascript
// User Schema mein
{ passwordChangedAt: Date }

// Middleware mein
const decoded = jwt.verify(token, SECRET);
const tokenIssuedAt = decoded.iat * 1000; // seconds → ms

if (user.passwordChangedAt && user.passwordChangedAt > tokenIssuedAt) {
  throw new Error("Password changed after login. Please login again.");
}
// Purana token tha, password baad mein change hua → reject ✅
// Naya token hai, password pehle change hua → allow ✅
```

*4. Auditing aur debugging:*
```javascript
// Kab login kiya tha?
const loginTime = new Date(decoded.iat * 1000);

// Token kab expire hoga?
const expiryTime = new Date(decoded.exp * 1000);

// Kitne time se logged in?
const sessionDuration = Date.now() - (decoded.iat * 1000);
```

---

## Section 6: DB Architecture

---

**Q: Server ki 3 copies hain toh DB ki bhi 3 copies hoti hain?**

Nahi! Sirf DB ki ek copy hoti hai (ya replication ke saath 2-3 but sab sync hoti hain). Sab servers usi ek DB se baat karte hain:

```
Load Balancer
     ↓
┌────┴──────────────┐
Server 1  Server 2  Server 3
     └────┬──────────┘
          ↓
     MongoDB (ek DB)
```

Agar har server ki apni DB hoti:
```
User → Server 1 pe login kiya → Server 1 ki DB mein token
User → Server 2 pe request gayi (load balancer ne bheja) → Server 2 ki DB mein token nahi → reject ❌
```

Shared DB ki wajah se:
```
User → Server 1 pe login → DB mein token save
User → Server 2 pe request → same DB check → token mila → allow ✅
User → Server 3 pe request → same DB check → token mila → allow ✅
```

Yahi distributed systems ka fundamental principle hai — **state DB mein hoti hai, servers mein nahi.**

---

## Section 7: Redis — Deep Dive

---

**Q: Redis kya hai exactly aur MongoDB se kaise alag hai?**

```
MongoDB:
Data → Hard Disk pe store hota hai
Server restart hone pe data safe rehta hai
Disk read/write → 5-10ms per operation
Complex queries support karta hai (aggregate, join-like operations)
Relationships handle kar sakta hai

Redis:
Data → RAM (memory) mein store hota hai
Server restart hone pe data gone (unless persistence enable ki ho)
Memory read/write → 0.1ms per operation (50-100x faster)
Sirf simple key-value operations
No complex queries
```

Analogy:
```
MongoDB = Almari (permanent storage, dhundne mein time lagta hai)
Redis   = Haath mein pakdi hui cheez (instant access, but limited space)
```

---

**Q: Redis token blocklist ke liye kaise use hota hai?**

```javascript
const redis = require("redis");
const client = redis.createClient();

// Logout pe
authRouter.post("/logout", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, SECRET);

  // Token kitne time mein expire hoga
  const timeLeft = decoded.exp - Math.floor(Date.now() / 1000);

  // Redis mein store karo sirf utne time ke liye
  await client.set(`blocked:${token}`, "true");
  await client.expire(`blocked:${token}`, timeLeft); // auto delete jab token expire ho

  res.clearCookie("token");
  res.send("Logged out");
});

// Har request pe check (middleware)
const isBlocked = await client.get(`blocked:${token}`);
if (isBlocked) throw new Error("Token invalid");
```

MongoDB blocklist vs Redis blocklist:
```
MongoDB check → disk read → 5-10ms
Redis check   → memory read → 0.1ms

1000 req/sec:
MongoDB → 5,000-10,000ms wasted sirf checking mein
Redis   → 100ms wasted sirf checking mein ✅
```

---

**Q: Redis caching kaise kaam karta hai?**

Caching ka matlab — ek baar DB se data fetch karo, Redis mein rakho, agle requests ke liye Redis se do:

```javascript
app.get("/posts", async (req, res) => {
  // Step 1: Redis mein dekho pehle
  const cachedPosts = await client.get("all_posts");

  if (cachedPosts) {
    console.log("Cache hit! DB nahi gaye");
    return res.send(JSON.parse(cachedPosts));
  }

  // Step 2: Redis mein nahi mila → DB se fetch karo
  console.log("Cache miss. DB se fetch kar rahe hain");
  const posts = await Post.find();

  // Step 3: Redis mein save karo agle request ke liye
  await client.set("all_posts", JSON.stringify(posts));
  await client.expire("all_posts", 300); // 5 min baad stale, fresh data lenge

  res.send(posts);
});
```

Real world impact:
```
Bina caching:
1000 users ne posts dekhe → 1000 DB queries → DB overloaded

Caching ke saath:
Pehla user → DB query → Redis mein save
Baaki 999 users → Redis se → 0 DB queries ✅
DB pe 999 queries kam ✅
Response 50x faster ✅
```

Cache invalidation — jab data change ho toh cache hata do:
```javascript
// Naya post add hua
app.post("/posts", async (req, res) => {
  await Post.create(req.body);
  await client.del("all_posts"); // purana cache delete karo
  // Agle request pe fresh data DB se aayega aur cache hoga
  res.send("Post created");
});
```

---

**Q: Rate limiting Redis se kaise kaam karta hai?**

```javascript
app.post("/login", async (req, res) => {
  const key = `login_attempts:${req.ip}`; // har IP ke liye alag key

  // Kitni baar try kiya is IP ne?
  const attempts = await client.get(key);

  if (attempts && parseInt(attempts) >= 5) {
    // TTL check karo — kitna time bacha hai block mein
    const ttl = await client.ttl(key);
    throw new Error(`Too many attempts. Try again in ${Math.ceil(ttl/60)} minutes`);
  }

  // Attempt count badhao
  await client.incr(key); // agar key nahi hai toh 0 se shuru karta hai automatically
  await client.expire(key, 15 * 60); // 15 minutes baad reset

  // Login logic...
  const user = await User.findOne({ email: req.body.email });
  // ...

  // Login successful → attempts reset karo
  await client.del(key);
  res.send("Login successful");
});
```

Flow:
```
IP 192.168.1.1 ne try kiya:
Attempt 1 → key set: login_attempts:192.168.1.1 = 1
Attempt 2 → 2
Attempt 3 → 3
Attempt 4 → 4
Attempt 5 → 5
Attempt 6 → 5 >= 5 → block! "Try again in 15 minutes" ✅
15 min baad → key expire → fresh start
```

Brute force attack practically impossible ho jaata hai.

---

**Q: Session storage ke liye Redis kyun better hai?**

```javascript
// Login pe session Redis mein store karo
const sessionData = {
  userId: user._id.toString(),
  email: user.email,
  loginTime: Date.now(),
  device: req.headers["user-agent"],
  ip: req.ip
};

const sessionId = crypto.randomUUID(); // unique session ID
await client.set(`session:${sessionId}`, JSON.stringify(sessionData));
await client.expire(`session:${sessionId}`, 24 * 60 * 60); // 1 din

res.cookie("sessionId", sessionId);

// Har request pe
const session = await client.get(`session:${req.cookies.sessionId}`);
if (!session) throw new Error("Session expired");
const sessionData = JSON.parse(session);
```

Kyun server memory mein nahi:
```
Server A pe session store kiya
Load balancer ne request Server B pe bheja
Server B ke paas session nahi ❌

Redis mein store kiya:
Server A, B, C sab Redis se session padhenge ✅
Server restart ho → Redis alag server pe hai → session safe ✅
```

---

**Q: Real-time features ke liye Redis kaise use hota hai?**

```javascript
// Online users track karna (Redis Sets use hote hain)
// User online hua
await client.sAdd("online_users", userId.toString());

// User offline hua
await client.sRem("online_users", userId.toString());

// Kitne log online hain?
const count = await client.sCard("online_users");

// Kon kon online hai?
const onlineUsers = await client.sMembers("online_users");

// ─────────────────────────────────

// Game leaderboard (Redis Sorted Sets)
// Score update karo
await client.zAdd("leaderboard", { score: 1500, value: userId.toString() });

// Top 10 players
const top10 = await client.zRangeWithScores("leaderboard", 0, 9, { REV: true });

// Meri rank kya hai?
const myRank = await client.zRevRank("leaderboard", userId.toString());
```

Yeh sab MongoDB mein bhi ho sakta hai but:
```
"Kaun online hai" → Redis → 0.1ms
"Kaun online hai" → MongoDB → 5-10ms + complex query

Real-time mein 0.1ms aur 10ms ka fark bahut bada hota hai
Thousands of users ke saath MongoDB yeh handle nahi kar sakta efficiently
```

---

**Q: Redis aur MongoDB mein se kab kya use karein?**

```
Redis use karo jab:
├── Data temporary hai (sessions, tokens, cache)
├── Bahut fast access chahiye (< 1ms)
├── Simple key-value structure hai
├── Auto-expiry chahiye (TTL)
└── Real-time features (counters, leaderboard, online users)

MongoDB use karo jab:
├── Data permanent hai (users, posts, orders)
├── Complex queries chahiye (filter, sort, aggregate)
├── Relationships hain (user ke posts, post ke comments)
├── Large data store karna hai
└── Data loss acceptable nahi hai
```

Production architecture:
```
User Request
     ↓
Redis (0.1ms checks):
  ├── Token blocked? → reject immediately
  ├── Rate limit? → reject immediately
  ├── Cache available? → return instantly
  └── Session valid? → proceed
     ↓ (sirf zaroorat pade toh)
MongoDB (5-10ms):
  └── Fresh data fetch → Redis mein cache → return
```

Redis ek intelligent gatekeeper hai — 90% requests ko MongoDB tak pahunchne hi nahi deta. MongoDB sirf tab hit hota hai jab genuinely naya data chahiye.

---

## Quick Reference

```
Cookie delete  →  Next request reject  →  Effectively logged out
JWT Stateless  →  Server kuch store nahi karta  →  Token hi sab kuch
iat            →  Har token unique  +  Age check  +  Password change detection
Blocklist      →  Logout ke baad bhi token invalid
TTL Index      →  Blocklist size manageable rehti hai
Redis          →  50-100x faster than MongoDB for simple operations
Redis + MongoDB→  Production ka standard architecture
```

😄