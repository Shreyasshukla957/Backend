# Express.json() Doubts

## What does express.json() do?

`express.json()` is middleware that converts JSON body data coming from the frontend into a JavaScript object, so we can use `req.body`.

### Example:

**Frontend sends (JSON body):**

```json
{ "id": 5, "bookname": "abc" }
```

**Backend after express.json():**

```javascript
req.body => { id: 5, bookname: "abc" }
```

## Note:

`express.json()` has no relation with `req.params`.

## URL Parameters (req.params)

- `req.params.id` comes from the URL
- URL data is always a **string**

### Example:

```
DELETE /book/5
req.params.id => "5"   (string)
```

### Converting params to number:

```javascript
Number(req.params.id); // => 5
parseInt(req.params.id); // => 5
```

## Query Parameters (req.query)

Query parameters in the URL come after the "?" symbol.

### Example:

```
GET /book?author=Paulo&id=2
```

Here:

- `author=Paulo` → query param
- `id=2` → query param
