# PATCH `/user` — Two Approaches

---

## Approach 1 — `for` loop with `await`

```javascript
app.patch("/user", async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];

    for (let item of updates) {
      const { id, ...update } = item;
      await User.findByIdAndUpdate(id, update, { runValidators: true });
    }

    res.send("Updated Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});
```

### How it works:

| Step | What happens |
|------|--------------|
| 1 | `req.body` is normalized to an array |
| 2 | `for` loop picks one item at a time |
| 3 | `{ id, ...update }` destructures each item |
| 4 | `await` pauses and waits for DB update to finish |
| 5 | Only then moves to the next item |
| 6 | After all items done → `res.send()` fires |

### Execution Flow:

```
Item 1 → await DB update → ✅ done
Item 2 → await DB update → ✅ done
Item 3 → await DB update → ✅ done
res.send("Updated Successfully") ✅
```

> **Sequential** — one by one, waits for each before moving to next.

---

## Approach 2 — `.map()` with `Promise.all`

```javascript
app.patch("/user", async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];

    await Promise.all(
      updates.map(({ id, ...update }) =>
        User.findByIdAndUpdate(id, update, { runValidators: true })
      )
    );

    res.send("Updated Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});
```

### How it works:

| Step | What happens |
|------|--------------|
| 1 | `req.body` is normalized to an array |
| 2 | `.map()` loops all items and fires DB updates **simultaneously** |
| 3 | Each DB call returns a **pending Promise** |
| 4 | `Promise.all` collects all Promises and **waits for ALL** to finish |
| 5 | Only after all done → `res.send()` fires |

### Execution Flow:

```
Item 1 → DB update fired ──┐
Item 2 → DB update fired ──┤→ Promise.all waits for all → ✅ done
Item 3 → DB update fired ──┘
res.send("Updated Successfully") ✅
```

> **Parallel** — all fire at once, waits for all to finish together.

---

## Why `.map()` alone doesn't work ❌

```javascript
// ❌ WRONG — never do this
updates.map(async ({ id, ...update }) => {
  await User.findByIdAndUpdate(id, update);
})
res.send("Updated") // fires immediately without waiting!
```

`.map()` is **synchronous** — it fires all callbacks and moves on immediately.
The `await` inside only pauses that **one callback**, not `.map()` itself.
So `res.send()` fires before any DB update completes.

---

## Key Difference

| | `for` loop | `.map()` + `Promise.all` |
|---|---|---|
| Execution | Sequential (one by one) | Parallel (all at once) |
| Speed | Slower | Faster |
| `await` works directly? | ✅ Yes | ❌ No, needs `Promise.all` |
| If one fails | Stops immediately | All fail together (`Promise.all`) |
| Readability | Easier to read | More concise |

---

## Simple Analogy

```
for loop       → Go to counter 1, wait, get food.
                 Then go to counter 2, wait, get food.
                 One by one. 🐢

Promise.all    → Send 3 people to 3 counters simultaneously.
                 Wait for all 3 to return with food.
                 Much faster! 🚀
```

---

## Bottom Line

- Use **`for` loop** when updates depend on each other or order matters.
- Use **`Promise.all` + `.map()`** when updates are independent and you want speed.