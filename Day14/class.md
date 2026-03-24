# JavaScript Class — Poora Concept (Hindi Mein) 🇮🇳

---

## 1. Problem — Bina Class Ke

Maan lo tumhe 3 students ka data store karna hai:

```javascript
const student1 = { name: "Shreyas", age: 20, marks: 85 }
const student2 = { name: "Mohan",   age: 22, marks: 90 }
const student3 = { name: "Rohan",   age: 21, marks: 78 }
```

Agar har student ka result nikalna ho:

```javascript
// Har baar same code repeat karna padega 😓
console.log(student1.marks >= 80 ? "Pass" : "Fail")
console.log(student2.marks >= 80 ? "Pass" : "Fail")
console.log(student3.marks >= 80 ? "Pass" : "Fail")
```

**Problem:** 100 students hain toh? Har baar same code likhoge? 😰

---

## 2. Normal Function Se Try

```javascript
function createStudent(name, age, marks) {
  return { name, age, marks }
}

function getResult(student) {
  return student.marks >= 80 ? "Pass" : "Fail"
}

const s1 = createStudent("Shreyas", 20, 85)
getResult(s1)
```

Thoda better — lekin **data aur function alag alag hain**, koi direct connection nahi.

---

## 3. Callback/Function Se Bhi Ho Sakta Hai?

Haan! Yeh bhi kaam karta hai:

```javascript
function Student(name, marks) {
  return {
    name,
    marks,
    getResult: function() { return marks >= 80 ? "Pass" : "Fail" }
  }
}

const s1 = Student("Shreyas", 85)
s1.getResult() // "Pass" ✅
```

**Toh Class ki zarurat kya hai?** 🤔

---

## 4. Problem Callback Mein — GEC Wala Concept

Yaad hai **Execution Context** ka concept?

```
Jitni baar function call hoga → utni baar naya Execution Context banega
```

```javascript
Student("Shreyas", 85)  // → New Execution Context bana
                        //   name, marks, getResult → sab NAYE bane
                        //   context khatam → getResult object mein reh gaya

Student("Mohan", 90)    // → Phir naya Execution Context bana
                        //   phir se naya getResult bana (copy!) 😓

Student("Rohan", 78)    // → Phir naya context
                        //   phir se naya getResult copy 😓
```

**Result:**

```
s1 = { name, marks, getResult: fn }  ← alag copy
s2 = { name, marks, getResult: fn }  ← alag copy
s3 = { name, marks, getResult: fn }  ← alag copy
```

Har object mein `getResult` ki **apni alag copy** ban rahi hai — **Memory waste!** ❌

---

## 5. Class — Sahi Solution

```javascript
class Student {

  // DATA
  constructor(name, age, marks) {
    this.name  = name
    this.age   = age
    this.marks = marks
  }

  // FUNCTIONS — sirf ek baar bante hain (prototype mein)
  getResult() { return this.marks >= 80 ? "Pass" : "Fail" }
  getGrade()  { return this.marks >= 90 ? "A" : "B" }
}
```

```
s1 = { name, marks } ──┐
s2 = { name, marks } ──┼──→ getResult() sirf ek jagah (prototype) ✅
s3 = { name, marks } ──┘

Function copy nahi banta — sirf data alag alag hota hai!
```

**Memory bachti hai** ✅

---

## 6. Real Life Se Samjho — McDonald's Example

```
Function/Callback wala:
Har branch ke paas apni alag recipe ki copy 📄📄📄 = Wasteful ❌

Class wala:
Recipe sirf HQ mein — sab branches wahan se use karti hain 📄 = Efficient ✅
```

```
Books wala example:
❌ Callback: Book 1 mein Chapter 5 copy, Book 2 mein copy, Book 3 mein copy
✅ Class:    Chapter 5 sirf library mein — sab wahan jaate hain
```

---

## 7. `new` Kyun Likhte Hain?

```javascript
const Detail = mongoose.model("user", detailSchema)
//    ^^^^^^
//    Detail ab ek CLASS hai

const user1 = new Detail({ name: "Shreyas", age: 20 })
//            ^^^
//            new = us class se naya object banana
```

```
new likhne se kya hota hai:
────────────────────────────────────────
Step 1: Ek naya KHALI object bana  →  {}
Step 2: Constructor chala          →  { name, age set hue }
Step 3: Woh object return hua      →  user1 mein aa gaya
```

> **Bina `new` ke → Error aayega** — class sirf ek definition hai, seedha call nahi kar sakte

---

## 8. Poora Comparison — Ek Jagah

| | Normal Object | Callback/Function | Class |
|---|---|---|---|
| **Data** | Ek hi baar | Alag hota hai | Alag hota hai ✅ |
| **Function** | Repeat karna padta | Har baar copy banti ❌ | Sirf ek jagah ✅ |
| **Memory** | Waste | Waste | Bachti hai ✅ |
| **Organization** | Messy | Thoda better | Best — sab packed |

---

## 9. Mongoose Mein Class Ka Use

```javascript
// Schema = Blueprint (koi DB interaction nahi)
const detailSchema = new Schema({ name: String, age: Number })

// Model = Class ban gayi (Collection ready)
const Detail = mongoose.model("user", detailSchema)

// new Detail() = RAM mein object bana
const user1 = new Detail({ name: "Shreyas", age: 20 })

// .save() = Ab database mein gaya
await user1.save()

// Shortcut — andar se new + save dono karta hai
await Detail.create({ name: "Mohan", age: 43 })
```

**Mongoose mein Class isliye use hoti hai** — kyunki ek Document ke saath `.save()`, `.find()`, `.update()`, `.delete()` — bahut saare kaam hain. Sab ek saath pack karna zaroori tha.

---

## 10. Summary — Ek Line Mein 🎯

> **Class = Ek Dabba** jisme **data** bhi hai aur us data pe kaam karne wale **functions** bhi hain — functions **sirf ek baar bante hain** (copy nahi hote), aur `new` likhne se us class ka ek **naya object RAM mein** banta hai.