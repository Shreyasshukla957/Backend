# Hashing — Password Security Zero to Advanced

---

## Pehle Samjho — Password DB mein Kyun Store Karna Padta Hai?
```
User signup karta hai  →  email + password deta hai
                               ↓
              Yeh data kahin store karna padega
                               ↓
                        Database mein jaata hai
```

Ab problem yeh hai — **password ko DB mein kaise store karo?**

Yahi se poori hashing ki kahani shuru hoti hai.

---

## Stage 1 — Sabse Pehla (Galat) Tarika — Plain Text Storage
```javascript
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  await User.create({ email, password }); // ❌ direct store
});
```

### DB kuch aisa dikhta hai:

| id | email | password |
|----|-------|----------|
| 1 | rahul@gmail.com | ilovecricket123 |
| 2 | priya@gmail.com | priya@2001 |
| 3 | amit@gmail.com | amitbhai999 |

### Problem kya hai?
```
Scenario 1 — DB Hack
Hacker DB access kar le  →  seedha saare passwords mil gaye
                          →  Game over 😱

Scenario 2 — Insider Threat
Tumhara hi koi developer DB dekhe
→  sab users ke passwords pata chal gaye

Scenario 3 — Logs mein leak
Kabhi kabhi password accidentally logs mein print ho jaata hai
→  koi bhi log access kare  →  password mil gaya
```

> **Real incident:** 2019 mein Facebook ne 600 million passwords
> plain text mein store kiye the internal logs mein.
> Lakhon employees unhe dekh sakte the. 😬

---

## Stage 2 — Doosra (Thoda Better) Tarika — Encryption

**Kuch log sochte hain** — plain text nahi store karte, encrypt karke store karte hain.
```
"ilovecricket123"  →  [ AES Encryption ]  →  "xK9#mP2$nR7@qL5"
```
```javascript
const encrypted = encrypt(password, SECRET_KEY);
await User.create({ email, password: encrypted });
```

### Kyun Yeh Bhi Galat Hai?
```
Encryption  →  Two-way hoti hai
             →  Matlab decrypt bhi ho sakta hai

Hacker SECRET_KEY chura le
        ↓
Saare passwords decrypt kar le
        ↓
Game over — phir wahi problem 😱
```

> **Encryption data transfer ke liye hai, password storage ke liye nahi.**

---

## Stage 3 — Sahi Tarika — Hashing

Hashing ek **one-way** process hai.
```
"ilovecricket123"  →  [ Hash Function ]  →  "a1b2c3d4e5f6..."
                                                    ↓
                                          Yeh wapas original
                                          password mein nahi
                                          badal sakta — EVER ❌
```
```javascript
const hash = bcrypt.hash(password, 10);
await User.create({ email, password: hash }); // ✅ hash store hota hai
```

### DB kuch aisa dikhta hai:

| id | email | password |
|----|-------|----------|
| 1 | rahul@gmail.com | $2b$10$N9qo8uLOickgx2ZMRZoSue4zM... |
| 2 | priya@gmail.com | $2b$10$K8mP3uLOickgx9ZMRZpTue7xN... |

> **Hacker DB bhi le jaaye → kuch nahi kar sakta** ✅
> Kyunki hash se original password nikalna impossible hai.

---

## Hashing Internally Kaise Kaam Karta Hai?
```
Input String
     ↓
[ Mathematical Algorithm ]
     ↓
Fixed-size Output (Hash)
```

Algorithm andar kya karta hai:
```
Step 1 — Input ko binary mein convert karo
         "hello"  →  01101000 01100101 01101100 01101100 01101111

Step 2 — Binary ko mathematical operations se process karo
         (XOR, bit shifting, modular arithmetic, compression)

Step 3 — Fixed size output nikalo
         →  2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

> Yeh process **deterministic** hai —
> same input → hamesha same output.
> Lekin **reverse** karna mathematically infeasible hai.

---

## Hash ke Attributes — Ek Ek Karke Samjho

---

### Attribute 1 — Deterministic
```
"hello"  →  2cf24dba...   (pehli baar)
"hello"  →  2cf24dba...   (100vi baar bhi same) ✅
```

> Isliye login pe compare kar paate hain.

---

### Attribute 2 — Fixed Output Size
```
"hi"                              →  64 characters
"Mera naam Rahul Kumar hai aur"   →  64 characters   ← same!
[entire Harry Potter book]        →  64 characters   ← same!
```

> Input size se koi farak nahi — output hamesha same length.

---

### Attribute 3 — One-Way (Pre-image Resistance)
```
"hello"         →  hash nikalna  →  milliseconds mein ✅
"2cf24dba..."   →  original nikalna  →  IMPOSSIBLE ❌
```

> **Mathematically prove hai** ki reverse karna infeasible hai.
> Brute force se try karo toh universe ki age se zyada time lagega.

---

### Attribute 4 — Avalanche Effect
```
"hello"   →  2cf24dba5fb0a30e26e83b2ac5b9e29e...
"Hello"   →  185f8db32921bd46d35d3e3be99b3e3e...   ← completely alag!
"hell0"   →  f6b4d8b8b0c5e2a1d3f7c9e5b2a8d4c1...   ← phir completely alag!
```

> Sirf ek character change  →  poora hash badal jaata hai.
> Isliye hacker guess nahi kar sakta ki "almost sahi" hash kya hoga.

---

### Attribute 5 — Collision Resistance
```
Collision  =  do alag inputs ka same hash aana

"hello"      →  abc123...
"world"      →  abc123...   ← yeh COLLISION hai ❌
```

Good hash functions mein collision practically impossible hoti hai.
```
SHA-256 possible outputs  =  2^256
                           =  115 quattuorvigintillion
                           =  observable universe ke atoms se bhi zyada

Collision dhundhna  =  iss mein se ek specific atom dhundhna 🔬
```

---

### Attribute 6 — Speed (Double-edged sword)
```
SHA-256   →  bahut fast hai
           →  ek second mein billions of hashes
           →  Passwords ke liye BAD ❌

bcrypt    →  intentionally slow hai
           →  ek second mein sirf kuch hashes
           →  Passwords ke liye GOOD ✅
```

> **Passwords ke liye slow hona feature hai, bug nahi.**
> Hacker brute force kare toh usse bhi slow milega.

---

## Salt — Sabse Important Concept

### Problem Without Salt:
```
User A: "password123"  →  abc123def...
User B: "password123"  →  abc123def...   ← SAME HASH! 😬
```

**Hacker kya karta hai — Rainbow Table Attack:**
```
Rainbow Table  =  Pre-computed hash list

password123   →  abc123def...
iloveyou      →  xyz789ghi...
admin123      →  mno456pqr...
[millions of common passwords aur unke hashes]

DB se hash chura  →  Rainbow table mein dhundho  →  Match mila  →  Password pata ✅
```

> Yeh attack isliye kaam karta hai kyunki same input = same hash.

---

### Solution — Salt!

**Salt** = ek random string jo hashing se pehle password ke saath mix hoti hai.
```
Salt generate karo  →  "xK9pL2mR"   (random, unique per user)
                              ↓
password + salt  →  "password123xK9pL2mR"
                              ↓
                      hash karo
                              ↓
                    completely alag hash
```
```javascript
// bcrypt automatically salt generate karta hai
const saltRounds = 10;
const hash = await bcrypt.hash("password123", saltRounds);

// Internally yeh hota hai:
// 1. Random salt generate: "xK9pL2mRqT7nS3wP"
// 2. password + salt combine: "password123xK9pL2mRqT7nS3wP"
// 3. 2^10 = 1024 baar hash karo (saltRounds ki wajah se)
// 4. Final hash mein salt embed karo
```

### Salt ka fayda:
```
User A: "password123" + "salt_A"  →  hash_A   ← alag
User B: "password123" + "salt_B"  →  hash_B   ← alag

Same password  →  alag hashes ✅
Rainbow table kaam nahi karega ✅
```

---

## bcrypt Hash Structure — Andar Kya Hota Hai?
```
$2b$10$N9qo8uLOickgx2ZMRZoSue4zMnqBLBSHMd0TPdBMiDhH7DpRBMCBu
 ↑   ↑  ←——————22 chars——————→ ←—————————31 chars—————————→
 |   |         Salt                        Hash
 |   |
 |  Cost Factor (10 = 2^10 = 1024 iterations)
 |
Algorithm version (2b = bcrypt)
```

### Yeh Structure Kyun Important Hai?
```
Salt hash ke andar hi stored hai
     ↓
Login pe bcrypt.compare() automatically salt nikal leta hai
     ↓
Phir same process repeat karta hai
     ↓
Compare karta hai
     ↓
Alag se salt store karne ki zaroorat nahi ✅
```

---

## Cost Factor (Salt Rounds) — Kya Hota Hai?
```javascript
bcrypt.hash(password, 10)  // 10 = saltRounds = cost factor
```
```
saltRounds = 10  →  2^10 = 1024 iterations
saltRounds = 11  →  2^11 = 2048 iterations   ← 2x slow
saltRounds = 12  →  2^12 = 4096 iterations   ← 4x slow
```

### Practical Impact:

| saltRounds | Tumhare liye (1 hash) | Hacker ke liye (1 billion hashes) |
|------------|----------------------|-----------------------------------|
| 10 | ~100ms | ~3 saal |
| 12 | ~400ms | ~12 saal |
| 14 | ~1.5 sec | ~50 saal |

> **Tumhe sirf ek hash banana hai** — thoda slow chalta hai.
> **Hacker ko billions banana hain** — unke liye impossible ho jaata hai. ✅

---

## Signup aur Login — Complete Flow

### Signup Flow:
```javascript
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Salt + Hash generate karo
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Step 2: Sirf hash store karo
  await User.create({ email, password: hashedPassword });

  res.send("User created ✅");
});
```
```
"mypassword"
      ↓
bcrypt.hash()
      ↓
Salt generate  →  "xK9pL2mR..."
      ↓
"mypassword" + salt  →  1024 baar hash
      ↓
"$2b$10$xK9pL2mR...final_hash"
      ↓
DB mein store ✅
```

---

### Login Flow:
```javascript
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Step 1: User dhundho
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found");

  // Step 2: Password compare karo
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    res.send("Login successful ✅");
  } else {
    res.status(401).send("Wrong password ❌");
  }
});
```
```
User enters: "mypassword"
      ↓
bcrypt.compare("mypassword", storedHash)
      ↓
storedHash se salt nikaalo  →  "xK9pL2mR..."
      ↓
"mypassword" + same salt  →  1024 baar hash
      ↓
Naya hash == stored hash?
      ↓
✅ Yes  →  Login success
❌ No   →  Wrong password
```

> **Secret yeh hai** — bcrypt kabhi decrypt nahi karta.
> Woh sirf **dobara hash** karta hai aur compare karta hai.

---

## Hacker Kaise Attack Karta Hai — Aur Hum Kaise Bachte Hain

---

### Attack 1 — Plain Text DB Dump
```
Hacker DB access kare  →  plain text passwords mil gaye
                        →  directly use kare  →  ✅ kaam kiya

Bachne ka tarika:
→  Kabhi plain text store mat karo
→  Hamesha hash store karo  ✅
```

---

### Attack 2 — Rainbow Table Attack
```
Hacker ke paas pre-computed table hai:
"password123"  →  abc123...
"iloveyou"     →  xyz789...

Chura hua hash  →  table mein match dhundho  →  password pata ✅

Bachne ka tarika:
→  Salt use karo
→  Salt ki wajah se same password ka alag hash hoga
→  Rainbow table useless ho jaayega  ✅
```

---

### Attack 3 — Brute Force Attack
```
Hacker ek ek combination try karta hai:
"aaaaaa"  →  hash karo  →  match?  No
"aaaaab"  →  hash karo  →  match?  No
...
Billions of attempts...

Bachne ka tarika:
→  bcrypt ka high cost factor use karo (saltRounds = 10+)
→  Har attempt slow hoga
→  Billions attempts  →  decades lagenge  ✅
```

---

### Attack 4 — Dictionary Attack
```
Common passwords ki list se try karta hai:
"password", "123456", "iloveyou", "admin"...

Bachne ka tarika:
→  Salt + high cost factor  →  har attempt slow
→  Users ko strong passwords enforce karo  ✅
```

---

### Attack 5 — Timing Attack
```
Hacker response time measure karta hai:
Wrong password  →  10ms
"Almost right"  →  10.5ms   ← isse guess karta hai

Bachne ka tarika:
→  bcrypt.compare() constant time mein run karta hai
→  Sahi ho ya galat — same time lagta hai  ✅
```

---

## Hashing Algorithms Comparison

| Algorithm | Speed | Safe for Passwords? | Kyun? |
|-----------|-------|---------------------|-------|
| MD5 | Bahut Fast | ❌ No | Collisions found, too fast |
| SHA-1 | Fast | ❌ No | Broken, too fast |
| SHA-256 | Fast | ❌ No | Too fast — brute force easy |
| SHA-512 | Fast | ❌ No | Too fast — brute force easy |
| bcrypt | Slow (intentional) | ✅ Yes | Salt + slow = secure |
| Argon2 | Slow (intentional) | ✅ Best | Modern, memory-hard |
| scrypt | Slow (intentional) | ✅ Yes | Memory-hard |

> **Rule of thumb:**
> General hashing (files, checksums)  →  SHA-256
> Password hashing  →  bcrypt / Argon2 — kabhi doosra mat use karo

---

## Common Mistakes — Jo Kabhi Mat Karo

### Mistake 1 — MD5 ya SHA se Password Hash Karna
```javascript
// ❌ WRONG
const hash = crypto.createHash("md5").update(password).digest("hex");
const hash = crypto.createHash("sha256").update(password).digest("hex");

// ✅ CORRECT
const hash = await bcrypt.hash(password, 10);
```

---

### Mistake 2 — Khud Salt Banana
```javascript
// ❌ WRONG — manually salt mat banao
const salt = Math.random().toString();
const hash = sha256(password + salt);

// ✅ CORRECT — bcrypt automatically karta hai
const hash = await bcrypt.hash(password, 10);
```

---

### Mistake 3 — Low Cost Factor
```javascript
// ❌ WRONG — too easy to brute force
const hash = await bcrypt.hash(password, 1);

// ✅ CORRECT — minimum 10, production mein 12
const hash = await bcrypt.hash(password, 12);
```

---

### Mistake 4 — Hash ko Log Karna
```javascript
// ❌ WRONG — hash bhi sensitive hai
console.log("Storing hash:", hashedPassword);

// ✅ CORRECT — kuch mat log karo password related
await User.create({ email, password: hashedPassword });
```

---

### Mistake 5 — Sync version use karna
```javascript
// ❌ WRONG — server block ho jaayega
const hash = bcrypt.hashSync(password, 10);

// ✅ CORRECT — async use karo hamesha
const hash = await bcrypt.hash(password, 10);
```

---

## Simple Analogy — Sab Kuch Ek Jagah
```
Plain text storage
→  Apna PIN ek diary mein seedha likh do.
   Diary chori  →  PIN expose. 😱

Encryption
→  PIN ko code mein likh do, chabi ek alag jagah rakho.
   Dono chori  →  PIN expose. 😱

Hashing (without salt)
→  PIN ko aisi bhasha mein badlo jo wapas nahi aa sakti.
   Lekin sab "1234" ka same translation jaante hain. 😬

Hashing (with salt + bcrypt)
→  PIN ko aisi bhasha mein badlo jo wapas nahi aa sakti.
   Har insaan ka ALAG translation ho.
   Translation karne mein 1 second lage.
   Chori bhi ho  →  kuch nahi kar sakta. ✅
```

---

## Bottom Line

| Concept | Kya Karta Hai |
|---------|---------------|
| **Hashing** | Password ko irreversible string mein convert karta hai |
| **Salt** | Har user ka unique random string — rainbow tables rokta hai |
| **Cost Factor** | Hashing ko slow karta hai — brute force rokta hai |
| **bcrypt.hash()** | Signup pe — password ko hash karta hai |
| **bcrypt.compare()** | Login pe — decrypt nahi, dobara hash karta hai |
| **One-way** | Hash se original kabhi nahi nikalta |
| **Avalanche Effect** | Chhoti change → poora hash alag |

- **Plain text** kabhi store mat karo.
- **Encryption** passwords ke liye nahi hai.
- **MD5 / SHA** passwords ke liye nahi hai — too fast.
- **bcrypt** use karo — salt + slow = secure.
- **saltRounds 10-12** production mein minimum rakho.