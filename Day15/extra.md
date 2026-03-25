# mongoose.model() — Collection + Schema

## ab mujhe ismein aisa lag rha h ki mongoose ek class h jiske andar model naam ka function h toh "user",Dataschema meine blue print diya aur mongoose.model() ne iss blueprint ka use krke yeh action perform kiya ki "user" collection par DataSchema laga diya
```js
const User = mongoose.model("user", DataSchema);
```

## Kya hua is line mein?

- `mongoose.model()` ko 2 cheezein di — collection ka naam `"user"` aur blueprint `DataSchema`
- Mongoose ne `"user"` collection par `DataSchema` ke rules laga diye
- `User` ab ek constructor ban gaya jisse collection par kaam kar sakte hain

## Simple flow
```
DataSchema (blueprint)
      +
"user" (collection naam)
      ↓
mongoose.model() ne dono ko joda
      ↓
User = ab ek constructor/class hai
```

## Ab User se yeh sab kar sakte hain
```js
new User({...})     // naya document banao
User.find()         // sab dhundho
User.findById()     // ek dhundho
User.deleteOne()    // delete karo
```

> **mongoose.model() = blueprint lo + collection pe lagao + kaam karne ka tool do** 🎯