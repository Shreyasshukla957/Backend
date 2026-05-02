## Express Router - Poora Concept Ek Jagah

---

## Problem

```javascript
// index.js - sab kuch yahan ❌
app.post("/auth/register", ...)
app.post("/auth/login", ...)
app.post("/auth/logout", ...)
app.get("/user/profile", ...)
app.patch("/user/update", ...)
app.delete("/user/delete", ...)
// bahut badi file!
```

---

## Solution - Similar routes ek file mein

```javascript
// authRouter.js - sirf auth related
const router = express.Router()
router.post("/register", ...)
router.post("/login", ...)
router.post("/logout", ...)
module.exports = router

// userRouter.js - sirf user related
const router = express.Router()
router.get("/profile", ...)
router.patch("/update", ...)
router.delete("/delete", ...)
module.exports = router
```

---

## index.js mein ek baar call

```javascript
// index.js
app.use("/auth", authRouter)  // ek baar → teeno auth routes mil gaye
app.use("/user", userRouter)  // ek baar → teeno user routes mil gaye
```

---

## URL kaise banti hai

```
app.use("/auth", authRouter)
        ↓
/register  →  /auth/register
/login     →  /auth/login
/logout    →  /auth/logout

app.use("/user", userRouter)
        ↓
/profile   →  /user/profile
/update    →  /user/update
/delete    →  /user/delete
```

---

## Folder Structure

```
project/
  ├── index.js
  └── routes/
       ├── authRouter.js
       └── userRouter.js
```

---

## Summary

| | |
|---|---|
| Similar routes | Ek file mein rakho |
| index.js mein | Ek baar `app.use()` se connect karo |
| Result | Clean, organized code ✅ |

> **Router = Similar routes ka drawer — ek baar kholo, sab mil jaata hai!**