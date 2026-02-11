# Distributed Systems, Sharding & Replication (In Depth)

## With SQL & NoSQL Context

---

## 1. Distributed System

### What is a Distributed System?

A **distributed system** is a system where multiple computers (nodes) work together to act as a single system.

These machines communicate over a network and share the workload.

### Real-World Example: Online Food Delivery App

When you place an order:

- One server handles login
- Another handles restaurant data
- Another handles payments
- Another handles delivery tracking

You see **ONE app**, but many machines are working behind the scenes.

This is a distributed system.

### Why Distributed Systems Are Needed

**Single machine limitations:**

- Limited CPU & RAM
- Hardware failure risk
- Cannot handle millions of users

**Distributed systems provide:**

- Scalability
- High availability
- Fault tolerance

### SQL vs NoSQL Context (Distributed Systems)

**SQL:**

- Originally designed for single-machine use
- Strong consistency
- Harder to distribute

**NoSQL:**

- Designed with distribution in mind
- Built to run on many machines
- Accepts relaxed consistency

---

## 2. Replication

### What is Replication?

**Replication** means keeping **MULTIPLE COPIES** of the **SAME data** on different machines.

**Goal:**

- Keep system available
- Protect data from failures

### Real-World Example: Bank ATM Network

Your bank balance exists in multiple data centers.

If one data center goes down:

- ATM still works
- Mobile banking still works

Because data is replicated.

### Replication Diagram

```
         CLIENT
           |
           v
    +---------+
    |PRIMARY DB|
    +---------+
      |     |
      v     v
   +---+ +---+
   |R1 | |R2 |
   +---+ +---+
```

All replicas store the **SAME data**.

### How Replication Works

1. **Write** goes to PRIMARY node
2. **Primary** updates its data
3. **Changes** are copied to replicas
4. **Replicas** stay (mostly) in sync

- Reads can be served from replicas
- Writes usually go to primary

### Types of Replication

#### Synchronous Replication

- Primary waits for replicas
- Strong consistency
- Slower writes

#### Asynchronous Replication

- Primary responds immediately
- Replicas update later
- Faster writes, slight inconsistency

### SQL vs NoSQL Context (Replication)

**SQL:**

- Commonly uses primary–replica model
- Strong consistency preferred
- Mostly for read scaling & failover

**NoSQL:**

- Replication is core feature
- Often automatic
- Designed for node failures

### Limitations of Replication

- ❌ Does NOT increase write capacity
- ❌ Replicas may lag
- ❌ Conflict handling is complex

**Replication improves RELIABILITY, not SCALABILITY**

---

## 3. Sharding

### What is Sharding?

**Sharding** means **SPLITTING data** into smaller parts (shards).

Each shard:

- Stores **DIFFERENT data**
- Lives on a different server

**Goal:**

- Handle massive data
- Increase write capacity
- Scale horizontally

### Real-World Example: Courier Warehouses

One warehouse cannot store all packages.

Company creates:

- North warehouse
- South warehouse
- West warehouse

Each warehouse stores **DIFFERENT packages**.

This is sharding.

### Sharding Diagram

```
           CLIENT
             |
             v
        APPLICATION
         /   |   \
        v    v    v
    +-+-+  +-+-+  +-+-+
    |SA | |SB | |SC |
    +-+-+  +-+-+  +-+-+
    1–1k  1k–2k  2k–3k
```

### Shard Key (Critical Concept)

**Shard key** decides where data goes.

**Examples:**

- UserID
- OrderID
- Region

**Good shard key:**

- Even data distribution
- Avoids hot shards

### Types of Sharding

#### Range-Based

- UserID 1–1000 → Shard A
- Simple, but risk of uneven load

#### Hash-Based

- `hash(UserID) % N`
- Even load, harder to rebalance

#### Directory-Based

- Lookup table → shard mapping
- Flexible but extra dependency

### SQL vs NoSQL Context (Sharding)

**SQL:**

- Sharding is hard
- JOINs across shards are slow
- ACID transactions become complex
- Often requires application-level logic

**NoSQL:**

- Sharding is built-in
- Avoids JOINs
- Designed for horizontal scale
- Eventual consistency is acceptable

---

## 4. Using Sharding + Replication Together

Large systems combine both:

- **Sharding** → scale data & writes
- **Replication** → protect data & reads

### Combined Diagram

```
              APPLICATION
                   |
       ----- ----- -----
       |     |     |
       v     v     v
     SA    SB    SC
     | |   | |   | |
     v v   v v   v v
    R1 R2 R1 R2 R1 R2
```

Each shard has replicas. Failure of one node does not stop system.

---

## Final Summary

### Distributed System

- Many machines act as one

### Replication

- Same data on many machines
- Improves availability & reliability

### Sharding

- Different data on many machines
- Improves scalability & capacity

### SQL

- Strong consistency
- Replication easy, sharding hard

### NoSQL

- Built for distribution
- Sharding and replication are core features
