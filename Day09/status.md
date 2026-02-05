# HTTP Status Codes

## Status Code Reference

| Code | Status                | Description                    |
| ---- | --------------------- | ------------------------------ |
| 200  | OK                    | Success                        |
| 201  | Created               | New resource created           |
| 204  | No Content            | Success but no response body   |
| 400  | Bad Request           | Client mistake                 |
| 401  | Unauthorized          | Login required / Invalid token |
| 403  | Forbidden             | No permission                  |
| 404  | Not Found             | Resource not found             |
| 500  | Internal Server Error | Server error                   |
| 502  | Bad Gateway           | Bad gateway                    |
| 504  | Gateway Timeout       | Gateway timeout                |

## Why Status Codes?

Server ko client ko clearly batana hota hai ki request ka result kya raha. Sirf text message se machine ko samajh nahi aata, numbers (status codes) easy hote hain.

## When to Use?

Har HTTP request ke response ke saath:

- Chahe success ho
- Chahe client ki galti ho
- Chahe server ki problem ho

## Purpose

Client (browser/app/API) ko next action decide karne mein help karna:

- Redirect karna
- Login karwana
- Retry karna
- Error dikhana

## How It Works

1. **Server** - Ek numeric code bhejta hai (200, 401, 404, 500 etc.)
2. **Client** - Us code ke base par automatic behavior trigger karta hai
3. **Examples**:
   - 401 → Login page
   - 404 → Not found page
   - 500 → Show server error
