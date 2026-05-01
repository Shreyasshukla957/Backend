## Prototype Chain — Pura Explanation

---

**1. MongoDB se sirf raw data aata hai — koi method nahi**
Jab `User.findById(id)` karte ho toh MongoDB se sirf ek plain object aata hai jisme sirf data hota hai — `Fname: "Raj"`, `age: 25` — koi `getJwt()` ya `save()` nahi hota us raw data mein — bilkul ek sada object hai.

---

**2. Mongoose us raw data ko wrap karta hai (matlab link attack kar deta hai)**
Mongoose seedha raw data return nahi karta — woh pehle `new User(rawData)` karta hai — is process mein JavaScript automatically ek **`[[prototype]]` hidden link attack kar deta hai** us object mein jo seedha `User.prototype` se connected hota hai — yahi wrapping hai.

```
Bina wrap                          Wrap karne ke baad
─────────────────────              ──────────────────────────────
people = {                         people = {
  Fname: "Raj"                       Fname: "Raj"
  age: 25                            age: 25
  koi link nahi ❌                   [[prototype]] ──→ User.prototype ✅
}                                  }
```

---

**3. `User.prototype` RAM mein rehta hai — DB mein nahi**
Tere saare custom methods jaise `getJwt()`, `getFName()` aur mongoose built-in methods jaise `save()`, `validate()` — yeh sab `User.prototype` pe store hote hain RAM mein — MongoDB mein kabhi nahi jaate.

```
MongoDB mein store hota hai        RAM mein store hota hai
────────────────────────────       ──────────────────────────
Fname: "Raj"          ✅           User.prototype
age: 25               ✅             getJwt()     ✅
Emailid: "r@g.com"    ✅             save()       ✅
                                     getFName()   ✅
getJwt()              ❌
save()                ❌
```

---

**4. Jab `people.getJwt()` call karte ho toh kya hota hai**
JavaScript pehle `people` ke andar dhundta hai — nahi mila — toh hidden link pakad ke `User.prototype` pe chala jaata hai — wahan milta hai — run ho jaata hai — yahi **prototype chain climbing** hai.

```
people.getJwt() call hua
        ↓
people ke andar dekha
  Fname: "Raj" ✅
  age: 25 ✅
  getJwt: ❌ nahi mila
        ↓
hidden link pakda — [[prototype]]
        ↓
User.prototype pe gaya
  getJwt: ✅ MIL GAYA
        ↓
run kar diya — aur this = people
```

---

**5. `this` us object ko point karta hai jisne method call kiya**
Method `User.prototype` pe ek hi hota hai — but `this` hamesha us specific object ko point karta hai jisne method call kiya — isliye `this.Fname` matlab us specific document ka `Fname`.

```javascript
user1.getJwt() // this = user1 → user1.Fname = "Raj"
user2.getJwt() // this = user2 → user2.Fname = "Priya"
```

---

**6. `people.getJwt()` call kiya toh `this` = `people` — har operation `people` ka kaam karta hai**
Jab `people.getJwt()` call karte ho — `this` ban jaata hai `people` — ab andar jo bhi operation karo — `this._id`, `this.Fname`, `this.age` — sab `people` ka data access karta hai — aur jo bhi return karo woh `const token` mein aa jaata hai.

```javascript
DataSchema.methods.getJwt = function() {
  return jwt.sign({ id: this._id }, "secretkey");
//                      ↑
//                 this = people
//                 matlab people._id liya
//                 JWT banaya
//                 return kar diya
}

const token = people.getJwt();
//    ↑
//    jo return hua — woh yahan store ho gaya
//    token = "eyJhbGciOiJIUzI1NiJ9..."

// this ke saath jo bhi likho — woh people ka kaam karta hai
this._id      // = people._id
this.Fname    // = people.Fname
this.age      // = people.age
this.Emailid  // = people.Emailid
```

---

**7. Baar baar kaise chalta hai**
Kyunki `User.prototype` RAM mein hamesha available rehta hai jab tak app chal raha hai — har baar jab koi document DB se fetch hota hai — Mongoose usse wrap karta hai — matlab hidden link attack kar deta hai — aur `User.prototype` se methods access ho jaate hain.

```
App start hua
      ↓
User.prototype RAM mein load hua — hamesha available
      ↓
person1 DB se fetch hua → wrap hua → link attack hua → getJwt ✅
person2 DB se fetch hua → wrap hua → link attack hua → getJwt ✅
person3 DB se fetch hua → wrap hua → link attack hua → getJwt ✅
```

---

**8. Bina wrap ke sirf data milta — methods nahi**
Agar Mongoose wrap na kare — matlab hidden link attack na kare — toh `people.Fname` toh milta — but `people.getJwt()` ERROR deta — kyunki koi raasta nahi hota `User.prototype` tak pahunchne ka.

```javascript
// bina wrap — bina link ke
people.Fname     // ✅ data toh milta — directly object mein hai
people.getJwt()  // ❌ ERROR — koi hidden link nahi
people.save()    // ❌ ERROR — koi hidden link nahi

// wrap ke baad — link attack hone ke baad
people.Fname     // ✅ data milta
people.getJwt()  // ✅ hidden link se User.prototype tak pahuncha
people.save()    // ✅ hidden link se User.prototype tak pahuncha
```

---

**9. Pura diagram ek saath**

```
MongoDB
┌─────────────────────────┐
│  raw data               │
│  Fname: "Raj"           │
│  age: 25                │
└──────────┬──────────────┘
           │ Mongoose ne fetch kiya
           ↓
      new User(rawData)
      wrap kiya — link attack kar diya
           ↓
people (User instance — RAM mein)
┌─────────────────────────┐
│  Fname: "Raj"           │
│  age: 25                │
│                         │
│  [[prototype]] ─────────┼────→ User.prototype (RAM mein)
│  (hidden link)          │      ┌──────────────────────┐
└─────────────────────────┘      │  getJwt()     ✅     │
                                 │  getFName()   ✅     │
                                 │  save()       ✅     │
                                 │  validate()   ✅     │
                                 └──────────────────────┘
           ↓
people.getJwt() call hua
people mein nahi mila ❌
hidden link se User.prototype pe gaya
getJwt mila ✅
this = people
this._id = people._id
JWT bana → return hua
const token mein store ho gaya ✅
```

---

**Ek line mein poora summary**

> MongoDB se **raw data** aata hai — Mongoose usse `new User(rawData)` se wrap karta hai matlab **hidden link attack kar deta hai** `User.prototype` se — ab JavaScript us link se climb karke koi bhi method dhundh leta hai — methods RAM mein rehte hain DB mein nahi — jab `people.getJwt()` call hota hai `this = people` ban jaata hai — `this._id` matlab `people._id` — function kaam karta hai return karta hai — aur **`const token` mein woh returned value store ho jaati hai**.


## One line understanding how people.getjwt() is able to call dataschema.methods.getjwt
mein aisa smjh sakta hu ki 'user' class ab 'people' object bn gya h ,jitna data user class k andar h wahi data people object mein honge bas value change rhegi kyunki 'user' ek class h jo predefined blueprint h aur 'people' uspar bna hua object jo schema rules follow kr rha h.

> ## Static vs Instance — Inbuilt vs Custom

`User.find()` aur `user1.save()` dono mongoose ke **inbuilt** methods hain — `User.findByEmail()` aur `user1.getJwt()` dono **custom** methods hain jo tune banaye — static aur instance ka matlab **kahan call hota hai** hai — inbuilt aur custom ka matlab **kisne banaya** hai — dono alag cheezein hain — dono categories mein inbuilt bhi hote hain aur custom bhi.

```javascript
// STATIC — class pe call hota hai
User.find()                // inbuilt — mongoose ne banaya
User.findById()            // inbuilt — mongoose ne banaya
User.findByEmail("r@g.com") // custom — tune banaya schema.statics se

// INSTANCE — object pe call hota hai
user1.save()               // inbuilt — mongoose ne banaya
user1.validate()           // inbuilt — mongoose ne banaya
user1.getJwt()             // custom — tune banaya schema.methods se
```