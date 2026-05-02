# Mongoose — Key Takeaways

## 1. `mongoose` is an Object
`mongoose` is an object just like `console` or `Math`. It has functions stored inside it. `.model` is one such function — calling it **builds and returns a Class**.

## 2. `const User` is a Class
`const User` is that returned Class. It sits in **RAM** while app runs. It holds all field definitions like `Fname`, `age` and rules like `required`, `min`, `max` and methods like `save()`. Think of it as a **blank form with rules printed on it**.

## 3. `new User({...})` creates Real Data
`new User({ Fname: "Raj" })` uses that blank form and **fills it with real data**. JavaScript creates a brand new empty object `{}` in RAM and `this` points to that empty object. Then fills it `this.Fname = "Raj"` — now it is a real object with actual data.

## 4. `this` points to the Document
`this` points to that empty object `{}`. That empty object is nothing but a **Document** — a place where one person's data will be stored. JavaScript first creates an empty document, `this` points to it, and then fills it with real data like `Fname: "Raj"` and `age: 25` — that is why `this` exists — to know **which document to fill**.

## 5. Document vs Collection
One person's filled data is a **Document**. When all documents sit together in MongoDB that entire group is called a **Collection**. Document is one filled form, collection is the entire folder of all filled forms.

## 6. RAM is the Checkpoint
Every new user object is created and validated in RAM first against the blueprint rules. If `age` is below 18 or `Fname` is missing it throws error right there. MongoDB is never touched — only after passing all rules `save()` sends data permanently to MongoDB.

## 7. RAM is Temporary, MongoDB is Permanent
`const User` lives in RAM while app runs and dies when app stops. Only the actual data sent via `user1.save()` lives permanently in MongoDB. **RAM is temporary, MongoDB is permanent**.

## 8. `const User` vs `const user1`

`const User` is a **Class** — a locked blueprint sitting in RAM — you cannot access data or call methods directly on it. Think of it as a **blank form with rules printed on it** — it knows what fields exist like `Fname`, `age` and what rules apply like `required`, `min`, `max` but it has no real data yet.

```javascript
const User = mongoose.model("user", DataSchema);

User.Fname    // ❌ cannot access — no real data
User.save()   // ❌ cannot call — just a blueprint
User.greet()  // ❌ cannot call — just a blueprint
```

`const user1` is an **Object** created from that class using `new User()` — the moment you write `new User()` JavaScript creates a brand new empty object `{}` in RAM, `this` points to it, fills it with real data and now `user1` has **full access** to every field, every rule and every method inside the blueprint.

```javascript
const user1 = new User({ Fname: "Raj", age: 25 });

user1.Fname       // ✅ "Raj"
user1.age         // ✅ 25
user1.save()      // ✅ saves to MongoDB
user1.greet()     // ✅ runs custom method
user1.validate()  // ✅ checks all rules
```

Think of `new User()` as the **bridge that converts a locked blueprint into a fully usable object** — before it `User` is just sitting locked in RAM — after it `user1` carries its own data and has full access to everything inside that blueprint — both your custom methods like `greet()` and mongoose built-ins like `save()` and `validate()`.

---

## 9. What YOU write vs What Mongoose does Internally

```javascript
// WHAT YOU WRITE
await User.create(req.body);


// WHAT MONGOOSE DOES INTERNALLY
const user1       = new User(req.body); // creates empty document {} in RAM
this.Fname        = data.Fname;         // fills the empty object
this.Lname        = data.Lname;         // fills the empty object
this.age          = data.age;           // fills the empty object
this.Emailid      = data.Emailid;       // fills the empty object
this.Password     = data.Password;      // fills the empty object
validate();                              // checks all rules against User blueprint
await save();                            // sends to MongoDB permanently
```


## 10. find() ka naam User.prototype pe hota hai — logic mongoose library mein
User.find() call karte ho — yeh naam User.prototype pe hota hai — but iska actual logic node_modules/mongoose/lib/model.js mein hota hai — bilkul same jaise browser mein setTimeout() ka naam Web API mein hota hai but actual kaam C++ binding layer mein hota hai — JavaScript sirf naam expose karta hai — heavy kaam hamesha neeche ki layer karta hai.
BROWSER                          MONGOOSE
────────────────────             ────────────────────
setTimeout()                     User.find()
  ↓ naam JS mein                   ↓ naam JS mein
  ↓ logic Web API mein             ↓ logic mongoose lib mein
  ↓ actual kaam C++ mein           ↓ actual kaam C++ driver mein
  ↓ result JS ko wapas             ↓ result JS ko wapas