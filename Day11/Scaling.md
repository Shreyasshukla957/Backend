# Vertical vs Horizontal Scaling

### In Context of SQL and NoSQL Databases

---

## What is Scaling?

Scaling means increasing a database's capacity to handle more users, more data, and more requests.

---

## Vertical Scaling (Scale Up)

### Real-World Example

One big bank office with one super-powerful vault.

Instead of opening new branches, the bank upgrades the same building:

- Bigger vault
- More staff
- Faster machines

### Database Context

Vertical scaling means **upgrading ONE server**:

- More RAM
- Faster CPU
- Better storage
- Same database instance

#### Example:

SQL database running on:

- 8 GB RAM → upgraded to 64 GB RAM
- 4 CPU cores → upgraded to 32 cores

---

## Why SQL Databases Prefer Vertical Scaling

SQL databases focus on:

- Strong consistency
- ACID transactions
- Centralized control

Vertical scaling keeps:

- One source of truth
- Simple transactions
- Easy joins

**This makes vertical scaling:**

- Simple
- Reliable
- Safer for structured data

---

## Limitations of Vertical Scaling

- ❌ Hardware has a limit
- ❌ Very expensive at high scale
- ❌ Single point of failure
- ❌ Downtime may be required

If the bank office shuts down, all services stop.

---

## Horizontal Scaling (Scale Out)

### Real-World Example

Opening many bank branches across cities.

Instead of one huge building, the bank opens multiple branches where customers are distributed across branches.

### Database Context

Horizontal scaling means **adding MORE servers** and distributing data among them.

#### Example:

NoSQL database running on:

- 1 server → expanded to 50 servers
- Each server handles part of the data

---

## Why NoSQL Databases Prefer Horizontal Scaling

NoSQL databases are designed for:

- Massive traffic
- High availability
- Flexible data structures

**Horizontal scaling allows:**

- Unlimited growth
- Fault tolerance
- Load distribution

If one branch goes down, others keep working.

---

## Challenges of Horizontal Scaling

- ❌ Data consistency is harder
- ❌ Requires sharding or replication
- ❌ Complex system design
- ❌ Eventual consistency is common

---

## SQL + Horizontal Scaling (Modern Approach)

Modern SQL systems also scale horizontally but with more complexity.

**Examples:**

- Read replicas
- Sharded SQL databases
- Distributed SQL systems

Still, complexity is higher compared to NoSQL.

---

## Final Comparison

### SQL + Vertical Scaling:

- Simple
- Strong consistency
- Limited scale

### NoSQL + Horizontal Scaling:

- Complex
- Highly scalable
- Flexible

---

## Final Takeaway

**Vertical scaling:** "Make one machine stronger"

**Horizontal scaling:** "Add more machines"

- SQL favors vertical scaling for **correctness**
- NoSQL favors horizontal scaling for **scale**

Large modern systems combine both to balance performance and reliability.

---
--------------------------------------------------------
## Why Horizontal Scaling is Hard in SQL (Summary)

SQL databases are designed assuming all related data lives on **ONE machine**.

Horizontal scaling breaks this assumption by spreading data across **MULTIPLE machines**.

---

## Key Difficulties

### 1) Data Sharding

- Data must be split across servers
- SQL must first find which server has the data

### 2) Join Operations

- SQL relies heavily on JOINs
- JOINs across servers require network calls
- Network JOINs are slow and expensive

### 3) ACID Transactions

- SQL guarantees strong consistency
- Transactions across servers need coordination
- (e.g., two-phase commit → slow & complex)

### 4) Consistency vs Network Failures

- Keeping all servers perfectly in sync during failures is difficult and costly

---

## Simple Diagram

```
       CLIENT
         |
         v
    APPLICATION
       /   \
      v     v
    DB A   DB B
  (Shard 1) (Shard 2)
```

Queries may need data from BOTH shards, causing latency and complexity.

---

## Final Takeaway

- **SQL can scale horizontally**, but it is complex and expensive
- **NoSQL avoids JOINs and relaxes consistency**, making horizontal scaling easier
