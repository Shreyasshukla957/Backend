# `.then/.catch` vs `async/await` + `try/catch`

## Dono ek hi kaam karte hain — bas likhne ka tarika alag hai

---

### `.then/.catch` wala tarika
```javascript
main()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server chalu on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error aaya:", err);
  });
```

---

### `async/await` + `try/catch` wala tarika
```javascript
async function start() {
  try {
    await main();
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server chalu on port 3000");
    });
  } catch (err) {
    console.log("Error aaya:", err);
  }
}

start();
```

---

## Mapping — Kaun kiska equivalent hai?
```
.then(()  => { ... })   ===   try   { await ...; ... }
.catch(err => { ... })  ===   catch (err) { ... }
```

---

## Flow Diagram
```
Promise resolve hua?
        │
        ├── ✅ YES
        │      ├── .then()   chalta hai
        │      └── try {}    chalta hai
        │
        └── ❌ NO (error)
               ├── .catch()  chalta hai
               └── catch {}  chalta hai
```