# Why SQL Isn't Preferred for Social Media Applications

## Quick Context: SQL vs NoSQL

### SQL Databases

- Use fixed tables and predefined schemas
- Strong consistency and data accuracy
- Best for structured and predictable data
- Commonly used for users, payments, orders

### NoSQL Databases

- Flexible or schema-less data structure
- Designed for high traffic and fast writes
- Easy horizontal scaling (add more servers)
- Best for feeds, likes, comments, chats

**Social media platforms usually use BOTH:**

- SQL for critical data
- NoSQL for high-speed interactions

---

## Real-World Example: Bank Ledger vs Street Food Market

### SQL DATABASE = Bank Ledger System

Every record must follow a strict format:

- Account number
- Name
- Amount
- Date

Accuracy is more important than speed. Any change in structure needs planning and approval.

This works perfectly for banking systems because money cannot afford mistakes.

### SOCIAL MEDIA = Busy Street Food Market

Thousands of customers arrive every minute. Everyone places a different order. Orders change frequently and unpredictably.

**Examples:**

- One customer wants extra cheese
- Another removes onion
- Another asks for a new topping never seen before

#### If the street food market followed bank rules:

- Every new topping would require new forms
- Stalls would stop to update records
- Long queues would form
- Customers would leave

This is exactly what happens when SQL is used alone for social media workloads.

---

## Why SQL Struggles in Social Media

### 1) Fixed Schema Problem

Social media features change constantly:

- Likes → Reactions → Emojis → Polls → Reels

SQL requires table changes for each update. This slows development and risks downtime.

### 2) Too Many Relationships

To show one feed, SQL must connect:

- Users → Followers → Posts → Likes → Comments

These JOIN operations become expensive at scale.

### 3) Heavy Write Traffic

- Likes, comments, views happen every second
- SQL uses locks to maintain consistency
- Locks slow the system during peak traffic

---

## Why NoSQL Fits Better

### NoSQL DATABASE = Street Food Order Slips

- Orders are written quickly
- Not all orders look the same
- New fields can be added instantly
- Multiple stalls work in parallel

Minor inconsistencies are acceptable because speed and availability matter more.

---

## Final Takeaway

| Type      | Characteristics                               |
| --------- | --------------------------------------------- |
| **SQL**   | Bank ledger - Accurate, strict, reliable      |
| **NoSQL** | Street food market - Fast, flexible, scalable |

**Social media applications need BOTH:**

- But for feeds and interactions, NoSQL is preferred over SQL
