# Distributed Data & Scaling

## Step 1: Single-Server System (Starting Point)

Everything runs on **ONE machine**:

- Application
- Database
- Requests

### Diagram

```
  USERS
    |
    v
 -----------
|  SERVER   |
| (APP+DB) |
 -----------
```

### Problems

- Limited CPU/RAM
- One crash = total downtime
- Cannot handle high traffic

---

## Step 2: Distributed System (Multiple Servers)

Work is split across multiple machines but system looks like **ONE** to the user.

### Diagram

```
  USERS
    |
    v
 -----------
|  APP 1   |
 -----------
 -----------
|  APP 2   |
 -----------
 -----------
|  APP 3   |
 -----------
```

### Benefits

- More capacity
- Fault tolerance
- Better performance

---

## Step 3: Load Balancer (Traffic Distribution)

Load Balancer distributes incoming requests.

### Diagram

```
         USERS
           |
           v
    ----------------
    | LOAD BALANCER |
    ----------------
       /     |      \
      v      v       v
  APP 1   APP 2   APP 3
```

**Without LB:**

- One app server gets overloaded

---

## Step 4: Database Becomes Bottleneck

Even if app scales, database is still **ONE**.

### Diagram

```
  APP 1  APP 2  APP 3
     \     |     /
          v
      -----------
     | DATABASE |
      -----------
```

### Problems

- Too many reads/writes
- Single point of failure

---

## Step 5: Replication (Data Copies)

Same data copied to multiple DB servers. **Goal:** availability + read scaling.

### Diagram

```
             DATABASE
                |
       ---------------------------
       |            |            |
       v            v            v
  REPLICA 1     REPLICA 2     REPLICA 3
```

---

## Step 6: SQL Replication Working

SQL uses **PRIMARY–REPLICA** model.

### Diagram

```
            LOAD BALANCER
                 |
       -------------------------
       |                       |
       v                       v
  PRIMARY DB            READ REPLICAS
   (WRITES)              (READS)
```

### Characteristics

- Writes only on primary
- Strong consistency
- Replicas follow primary

---

## Step 7: NoSQL Replication Working

NoSQL allows multiple nodes to handle traffic.

### Diagram

```
            LOAD BALANCER
                 |
       --------------------------------
       |               |              |
       v               v              v
    NODE A          NODE B          NODE C
  (READ/WRITE)   (READ/WRITE)   (READ/WRITE)
```

### Characteristics

- No single leader (often)
- Eventual consistency
- High availability

---

## Step 8: Limitation of Replication

Replication copies data, but data size still grows.

All replicas still hold **FULL data**. Write capacity is limited.

### Solution Needed

→ **Split data itself**

---

## Step 9: Sharding (Data Splitting)

Data is split across servers. Each server holds **DIFFERENT data**.

### Diagram

```
             APPLICATION
                  |
       --------------------------------
       |              |               |
       v              v               v
   SHARD A        SHARD B          SHARD C
 (Users 1–1k)   (Users 1k–2k)   (Users 2k–3k)
```

### Benefits

- High write throughput
- Horizontal scalability

---

## Step 10: Sharding in SQL vs NoSQL

### SQL Sharding (Complex)

Users Table → Shard A  
Posts Table → Shard B

#### Diagram

```
    SHARD A           SHARD B
  -----------       -----------
  | USERS DB | <--> | POSTS DB |
  -----------       -----------
```

- JOINs require network calls
- ACID transactions are hard

### NoSQL Sharding (Built-In)

#### Diagram

```
    NODE A          NODE B          NODE C
 (User 1 data)  (User 2 data)  (User 3 data)
```

- Related data stored together
- JOINs avoided

---

## Step 11: Sharding + Replication Together

Each shard has replicas.

### Diagram

```
             APPLICATION
                   |
       ---------------------------------
       |               |               |
       v               v               v
   SHARD A          SHARD B          SHARD C
    |   |            |   |            |   |
    v   v            v   v            v   v
  R1   R2          R1   R2          R1   R2
```

**Failure of one node does NOT stop the system**

---

## Step 12: CAP Theorem (Simple)

### What is CAP?

**C** = Consistency (everyone sees same data)  
**A** = Availability (system always responds)  
**P** = Partition Tolerance (system works when network breaks)

**Pick 2 out of 3** - you can't have all three.

### Simple Diagram

```
       CONSISTENCY
            /\
           /  \
         CP    CA
        /        \
       /          \
    AVAILABILITY--PARTITION
```

---

### 2 Main Choices

#### **CP** - Consistency + Partition (Sacrifice Availability)

Example: **Bank ATM**

```
Network breaks:
ATM: "I'm not sure if bank knows"
ATM: ❌ BLOCKS (you wait)

Better unsafe than WRONG
```

#### **AP** - Availability + Partition (Sacrifice Consistency)

Example: **Instagram Likes**

```
Network breaks:
Server A: Accepts like = 101 ✓
Server B: Still shows = 100 (old)
❌ Inconsistent, but ✓ Always responding

Later syncs = Eventually consistent
```

---

### Quick Comparison

|                       | CP                | AP              |
| --------------------- | ----------------- | --------------- |
| **Example**           | 🏦 Bank           | 📱 Instagram    |
| **If network breaks** | Blocks you (safe) | Responds (fast) |
| **Data**              | Always correct    | Might be old    |
| **Best for**          | Money/health      | Likes/feeds     |

---

## Step 13: SQL vs NoSQL CAP Choice

### SQL → **CP** (Blocks if unsure)

```
Network breaks:
PRIMARY DB: "Stop all writes"
REPLICA: "Can't talk"

User: ❌ Request BLOCKED (safe choice)
```

### NoSQL → **AP** (Always responds)

```
Network breaks:
NODE A: "Accept writes" ✓
NODE B: "Accept writes" ✓

They have different data (inconsistent)
Later they sync = Eventual consistency
```

**Note:** NoSQL typically uses AP, but some (like Cassandra) can be tuned for CP if needed , because it it "Not only SQL" it can use CA and CP both.

---

## Step 14: Final Big Picture

| Component         | Purpose            |
| ----------------- | ------------------ |
| **Load Balancer** | Spreads traffic    |
| **Replication**   | Protects data      |
| **Sharding**      | Scales data        |
| **CAP**           | Defines trade-offs |

### SQL

- Strong consistency
- Controlled scaling
- Correctness first

### NoSQL

- Designed for distribution
- Highly available
- Performance first
