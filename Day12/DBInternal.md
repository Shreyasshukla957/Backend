# Database Internals & Storage Engine Architecture

## DATABASE STORAGE, MEMORY, INDEXING & DATA STRUCTURES

A chronological deep dive into the end-to-end internal working of databases.

---

## Step 1: Logical Data (Application View)

The application (Instagram, backend service, API) thinks in terms of tables:

```
Instagram_Users
-----------------------------------
id | username | phone | email
```

### Key Points:

- This is **ONLY** a logical abstraction
- The database engine does **NOT** store rows or columns like Excel
- Internally, everything is **bytes + memory addresses**
- First transformation happens here: **ROW → MEMORY LOCATION**

---

## Step 2: Primary Key to SSD Address Mapping (Index Creation)

Database creates an index on PRIMARY KEY (`id`):

```
id      SSD_Address
-------------------
10  ->  1000
12  ->  1002
14  ->  1005
18  ->  1006
20  ->  1010
```

### Key Points:

- This structure itself is an **INDEX**
- **Key** = id
- **Value** = physical SSD address
- Actual row data (username, phone, email) lives at those SSD addresses
- Database **NEVER** scans entire data files
- It **always** searches index first

---

## Step 3: Why Index Cannot Be a Simple Array

If stored as a plain array:

```
[10, 12, 14, 18, 20]
```

### Problems:

- Search would be **O(n)**
- For millions of rows → unacceptable
- SSD access is expensive → every extra comparison hurts

### Solution:

- Database uses **TREE-BASED INDEXING**

---

## Step 4: Tree-Based Index (Conceptual View)

Binary Search Tree idea (conceptual):

```
           14
         /    \
        12      18
       /          \
      10            20
```

### Key Points:

- **Left subtree** < node
- **Right subtree** > node
- **Search time**: O(log n)
- Databases actually use **B-Trees / B+Trees** (multi-child trees), but conceptually this explains the idea

---

## Step 5: Search Flow (Query Execution Path)

Query:

```sql
SELECT * FROM users WHERE id = 18;
```

### Execution Flow:

1. Search index tree for key = 18 → **O(log n)**
2. Get SSD address = 1006
3. Jump directly to SSD address
4. Fetch row data

### Why It Matters:

- **No** full table scan
- **No** unnecessary reads
- This is why indexes exist

---

## Step 6: SSD Storage Reality (Byte Addressable)

SSD is byte-addressable memory:

```
Addressable Units:
[ ][ ][ ][ ][ ][ ][ ][ ] ...
```

### Key Points:

- Every byte has an address
- **But** SSD cannot overwrite data in-place efficiently
- Writes happen in **BLOCKS (pages)**
- Typical DB Page: **4KB / 8KB** block
- Database works with **PAGE** → not individual bytes

---

## Step 7: Sorted vs Unsorted Storage (Inside a Page)

### Unsorted Page:

```
[14, 10, 20, 12, 18]
```

- **Insert**: O(1) (append)
- **Search**: O(n)
- Fast writes, slow reads

### Sorted Page:

```
[10, 12, 14, 18, 20]
```

- **Search**: O(log n)
- **Insert/Delete**: O(n) (shifting required)
- Databases maintain balance using trees

---

## Step 8: Range Query Logic (Array Address Math)

### Addresses:

```
1000, 1004, 1008, 1012, 1016, 1020
```

### Formula:

```
address = base + (index * size)
```

### Example:

```
base = 1000
index = 3
size = 4 bytes

address = 1000 + 3*4 = 1012
```

### Key Points:

- This is how **ARRAYS** work in RAM
- Direct addressing → **O(1)**
- SSD does **NOT** allow this freely → needs indexes

---

## Step 9: Insert Operation Cost

### Unsorted Structure:

- **Time** = O(1)

### Sorted Structure:

- **Time** = O(n)

### Key Points:

- DB inserts often go to memory buffer first
- Later flushed to disk
- Tree nodes may split (B-Tree node split)

---

## Step 10: Delete Operation Cost

### Delete Process:

- Mark record as deleted (lazy delete)
- Actual cleanup happens later (compaction)

### Why This Approach:

- Immediate delete causes heavy disk I/O
- DB avoids physical deletion instantly

---

## Step 11: Update Operation Cost

### Update Flow:

1. Search index → **O(log n)**
2. Modify record
3. Often write to **NEW location**
4. Old record marked invalid

### Key Points:

- SSD does **NOT** like overwrites
- **Update ≠ overwrite**
- **Update** = new write + pointer change

---

## Step 12: RAM Addressing & Bit Calculation

### Example:

```
RAM = 8GB

1 GB = 2^30 bytes
8 GB = 2^33 bytes
```

### Key Points:

- To address 2^33 bytes → need **33-bit address**
- Modern systems use **64-bit addressing**
- Extra bits support:
  - Virtual memory
  - Huge address spaces

---

## Step 13: Node Structure (Tree Internals)

### Tree Node Structure:

```
[ DATA | LEFT_POINTER | RIGHT_POINTER ]
```

### Key Points:

- Pointers store memory addresses
- Balanced trees ensure **O(log n)** operations

---

## Step 14: Balanced vs Unbalanced Trees

### Unbalanced Tree (Bad):

```
10
  \
   20
     \
      30
        \
         90
           \
            50
```

- **Height** = n
- **Search** = O(n)
- Essentially becomes a linked list

### Balanced Tree (Good):

```
           30
         /    \
        20      50
       /       /
      10       40
```

- **Height** = log n
- **Predictable performance**
- Databases enforce balance automatically

---

## Final Big Picture (End-to-End Flow)

```
SQL Query
   ↓
Index (B-Tree)
   ↓
SSD Address
   ↓
Page Read
   ↓
Row Data
```

### Why Each Step Matters:

- **Index** avoids full scan
- **Trees** avoid linear search
- **Pages** optimize disk I/O
- **RAM buffers** hide SSD latency

---

# B+ TREE — COMPLETE DEEP DIVE (Understanding Why Databases Use B+ Trees)

## Why Does B+ Tree Exist?

### Root Problem

Data is stored on **SSD, not RAM**. This fundamental architectural constraint drives the entire design of B+ Trees.

### SSD Structure Reality

```
SSD Storage Layout:
[ Page 1000 ] → 4KB block
[ Page 1001 ] → 4KB block
[ Page 1002 ] → 4KB block
[ Page 1003 ] → 4KB block
...

Each page = 4KB / 8KB / 16KB physical storage unit
```

### The Cost Scenario

Imagine 100 million user rows exist in database.

**Without Index (Full Table Scan):**

```sql
SELECT * FROM users WHERE id = 50000000;
```

Database execution:

- Read Page 1 → Check: is id 50000000 here? → NO
- Read Page 2 → Check: is id 50000000 here? → NO
- Read Page 3 → Check: is id 50000000 here? → NO
- ... (50 million disk reads!)
- Read Page 50,000,000 → FOUND!

**Performance:**

- Time Complexity: **O(n) = 50 million disk reads!**
- Time: ~50 seconds (unacceptable!)

**Core Need:**
Database needs a structure that allows **direct jump to correct page** without scanning.

---

## Why Not Use a Simple Sorted Array?

### Array Structure Example

```
[10, 20, 30, 40, 50, 60, 70]
```

### Advantages

- Binary search possible: **O(log n)** → Fast lookups!

### Critical Problem: Insert Operations

```
Insert 25:
Before: [10, 20, 30, 40, 50, 60, 70]
After:  [10, 20, 25, 30, 40, 50, 60, 70]
                ↑ All elements after must shift!
```

**Real Cost on Disk:**

- Moving elements requires physical disk page reorganization
- EXTREMELY expensive I/O operations
- Time Complexity: **O(n) per insert**
- Database cannot afford this with millions of inserts per day

**Conclusion:** Array-based indexing is **unacceptable for SSD storage**.

---

## Why Not Use a Normal Binary Search Tree?

### BST Limitation

```
          30
        /    \
      20      50
     /       /
   10      40
```

**Problem:** Each node stores **only 1 key**.

### The Cascading Problem

```
100 million rows
    ↓
100 million BST nodes (one key per node)
    ↓
Worst-case search path = tree height = log₂(100M) = ~27 levels
    ↓
27 disk reads needed per search!
```

### Why This Is Bad

- One disk read per level
- 27 disk reads = 27 milliseconds (very slow)
- SSD read latency dominates query time

**Root Cause:**
BST has **branching factor = 2** (only 2 children per node)

---

## What is Branching Factor?

### Definition

**Branching Factor** = Number of children a node can have

### Comparison

**Binary Search Tree:**

```
Node capacity = 1 key
Children per node = 2
Branching Factor = 2

     N
    / \
   L   R
```

**B+ Tree:**

```
Node capacity = 100-1000 keys
Children per node = 100-1000
Branching Factor = 1000+

          N
   / / / | \ \ \
  C1 C2 C3 C4 C5
```

### Impact on Tree Height

```
For 1 Billion rows:

BST with branching factor 2:
  Tree height = log₂(1B) = ~30 levels
  Disk reads needed = 30

B+ Tree with branching factor 1000:
  Tree height = log₁₀₀₀(1B) = 3-4 levels
  Disk reads needed = 3-4

Speedup: 10x FASTER!
```

---

## How B+ Tree Fixes This

### B+ Tree Node Structure

```
Internal Node:
[10 | 20 | 30 | 40 | 50]  ← Multiple keys in ONE node
 ↓    ↓    ↓    ↓    ↓
keys determine which child to visit:
- values < 10 → child 1
- values 10-20 → child 2
- values 20-30 → child 3
- values 30-40 → child 4
- values 40-50 → child 5
- values > 50 → child 6
```

### The Critical Insight

**ONE node = ONE disk page**

This is the KEY design decision.

**Practical Calculation:**

```
Page Size = 16KB
Key Size = 8 bytes (64-bit integer)
Pointer Size = 8 bytes (memory address)
Entry Size = 16 bytes

Keys per page = 16KB / 16 bytes = 1,024 keys!

Result:
Branching Factor = 1,024
One disk read = 1,024 keys checked!
```

### Example Tree Structure

```
With Branching Factor 1000:

Level 1 (Root):     1,000 keys
Level 2 (Internal): 1,000 × 1,000 = 1,000,000 keys
Level 3 (Internal): 1,000,000 × 1,000 = 1,000,000,000 keys (1 billion!)
Level 4 (Leaf):     Actual data pointers

1 billion rows searchable in just 4 disk reads!
```

---

## How Search Speed Improves

### Mathematical Proof

**Traditional Binary Search on SSD:**

```
1 billion rows
Disk reads = log₂(1B) = 30-40 disk reads
Time ≈ 30-40 milliseconds
```

**B+ Tree Search:**

```
1 billion rows
Disk reads = log₁₀₀₀(1B) = 3-4 disk reads
Time ≈ 3-4 milliseconds
```

**Performance Improvement: 10x FASTER!**

---

## Where is Actual Data Stored? (Critical Distinction)

### Important: Internal vs Leaf Nodes

**Internal Nodes (Non-Leaf):**

```
[ 20 | 40 | 60 ]  ← Stores ONLY keys and child pointers
 ↓     ↓     ↓
→ Page 2000
→ Page 3000
→ Page 4000

Does NOT contain actual row data!
```

**Leaf Nodes (Bottom Level):**

```
[ 10 → Page 5000 ]   ← Key → Data page address
[ 20 → Page 6000 ]
[ 30 → Page 7000 ]

These pages (5000, 6000, 7000) contain ACTUAL ROW DATA
(username, phone, email, etc.)
```

### Complete Data Flow

```
User Query
    ↓
Navigate B+ Tree
    ↓
Find key in Leaf Node
    ↓
Get Data Page Address
    ↓
Load Data Page from SSD
    ↓
Return Complete Row
```

---

## Why Are Leaf Nodes Linked?

### Leaf Node Linked List

```
[10,15,20] → [30,35,40] → [50,55,60] → [70,75,80]
   ↓            ↓            ↓            ↓
   (linked with pointers for sequential access)
```

### Advantage: Range Queries

```sql
SELECT * FROM users WHERE id BETWEEN 20 AND 60;
```

**Execution:**

1. Use tree to find first key = 20 (in leaf node) → O(log n)
2. Follow linked list: [20, 30, 35, 40, 50, 55, 60]
3. No tree re-traversal needed!

**Performance:**

- O(log n) to find start + O(k) to collect k results
- Far better than separate index lookups

---

## B+ Tree Search: Step-by-Step Example

### Example Tree Structure

```
                Root [50]
               /          \
        Level 2:
    [20|40]           [60|80]
    /  |  \           /  |  \

Level 3 (Leaf):
[10,15] [20,30] [40,45] [60,70] [80,90]
```

### Search for id = 45

**Step 1: Load and check Root Page (Page 1)**

```
Root contains: [50]
Question: 45 < 50?
Answer: YES → Go to LEFT child
Disk reads: 1
```

**Step 2: Load and check Internal Page (Page 2000)**

```
Node contains: [20|40]
Question: 45 > 20? YES
Question: 45 > 40? YES (check next range boundary)
Answer: Go to RIGHTMOST child
Disk reads: 2
```

**Step 3: Load Leaf Page (Page 3000)**

```
Node contains: [40, 45, 50]
Found: 45 ✓
Get Address: Data is at SSD_5000
Disk reads: 3
```

**Step 4: Load Data Page (SSD_5000)**

```
Returns: { id: 45, username: "john_45", phone: "xxx", email: "xxx" }
Disk reads: 4
```

**Result:**

- Disk reads to find 1 row among billions: **4 reads**
- Time: ~4 milliseconds

---

## B+ Tree Insert Operation

### Case 1: Simple Insert

```
Insert 25 into leaf [20, 30]:

Before: [20, 30]
After:  [20, 25, 30]
Status: OK - Space available

Cost: 2 disk writes (leaf node update + parent update)
```

### Case 2: Page Full - Node Split

```
Leaf page FULL: [10, 20, 30, 40]

Insert 35:
Attempted: [10, 20, 30, 35, 40] → TOO MANY!

SPLIT OPERATION:
Original: [10, 20, 30, 40]
         ↓
Left:  [10, 20]
Right: [30, 40]
Promote: 30 (middle key) to parent node

New Structure:
Parent: [..., 20|30, ...]
         /            \
      [10, 20]    [30, 40]

Cost: Multiple disk writes (leaf split + parent update)
      Tree rebalancing overhead worth it for insert stability
```

### B+ Tree Property

**Tree automatically stays BALANCED** after every operation!

---

## B+ Tree Delete Operation

### Simple Delete

```
Leaf: [10, 25, 30]
Delete 25:
After: [10, 30]

Status: OK - Still has minimum keys

Cost: 1-2 disk writes
```

### Delete with Underflow

```
Leaf: [10] only
Delete 10:
After: [] → EMPTY (underflow!)

MERGE OPERATION:
Merge with sibling: [10] + [20, 30] = [10, 20, 30]

Parent node updates necessary
Cost: Multiple disk writes (merge + parent update)
```

---

## Where is B+ Tree Stored?

### Physical Storage on SSD

```
SSD Organization:

Page 1000 → Root Node (Index)
Page 2000 → Internal Node (Index)
Page 3000 → Leaf Node (Index with data pointers)
Page 4000 → Leaf Node (Index with data pointers)
...

Page 5000 → Actual Data Row 1: {id:10, username:"alice", ...}
Page 5004 → Actual Data Row 2: {id:15, username:"bob", ...}
Page 5008 → Actual Data Row 3: {id:20, username:"charlie", ...}
...
```

### Loading Process

1. Database starts search from root page (Page 1000)
2. Each level loads next page into RAM buffer
3. When leaf node is found, get data page address
4. Load and return actual data

---

## Why Node Size = Page Size?

### Design Optimization Reasoning

**Problem: Efficiency Matching**

```
SSD Physical Limitation:
One disk read operation = retrieves ONE FULL PAGE

If Node Size < Page Size:
    Disk reads full page (e.g., 16KB)
    But node uses only part of it (e.g., 4KB)
    Result: WASTED data transfer

If Node Size > Page Size:
    Need multiple disk reads per node
    Example: 20KB node needs 2 pages read
    Result: MORE DISK READS = SLOWER

Optimal:
    Node Size = Page Size = ONE DISK READ
```

### Real-World Matching

```
Page Size Effects:

16KB page with 8byte keys and pointers:
  → 1024 keys per page
  → Branching factor = 1024
  → Tree depth for 1B rows = log₁₀₂₄(1B) = 3-4

8KB page with same data:
  → 512 keys per page
  → Branching factor = 512
  → Tree depth for 1B rows = log₅₁₂(1B) = 4-5

Trade-off effect visible!
```

---

## Who Decides Node Size?

### Database Engine Configuration

Different databases choose different page sizes:

```
MySQL InnoDB:    16KB (default)
PostgreSQL:      8KB (tunable)
Oracle Database: 8KB (tunable)
SQLite:          4KB (default, tunable)
MongoDB:         16KB (internal)
RocksDB:         varies by configuration
```

### Trade-off Analysis

**Larger Pages (16KB+):**

- **Pros:**
  - More keys per node
  - Shallower tree
  - Fewer disk reads per query
  - Better for range queries
- **Cons:**
  - More RAM needed for buffers
  - Insert/delete operations slower
  - More data moved per write

**Smaller Pages (4KB-8KB):**

- **Pros:**
  - Less RAM needed
  - Faster insert/delete operations
  - Faster garbage collection
- **Cons:**
  - Fewer keys per node
  - Deeper tree structure
  - More disk reads needed
  - Slower range queries

**DBAs choose based on workload:**

- Read-heavy → Larger pages
- Write-heavy → Smaller pages

---

## Why B+ Tree is Perfect for Disk Storage

### Six Key Advantages

| Feature                     | Benefit                | Impact                 |
| --------------------------- | ---------------------- | ---------------------- |
| **Minimizes Disk Reads**    | O(log n) height        | 1B rows = 3-4 reads    |
| **Maximizes Keys Per Page** | 1000+ keys per node    | Branching factor huge  |
| **Keeps Tree Shallow**      | Few levels to traverse | Low latency queries    |
| **Supports Fast Insert**    | Node split mechanism   | O(log n) amortized     |
| **Supports Fast Delete**    | Node merge mechanism   | Maintains balance      |
| **Range Query Support**     | Leaf node linking      | Sequential access fast |

---

## Complete End-to-End Query Execution

### Real Query Walkthrough

```sql
SELECT * FROM users WHERE id = 25;
```

### Execution Timeline

```
Step 1: Load Root Page from SSD
Time: ~0.1ms
Disk I/O: 1 read
Action: Compare id 25 with root keys, determine child direction

Step 2: Load Internal Node Page from SSD
Time: ~0.1ms
Disk I/O: 2 total reads
Action: Navigate through keys, determine next child

Step 3: Load Leaf Node Page from SSD
Time: ~0.1ms
Disk I/O: 3 total reads
Action: Find key 25, get data page address = SSD_5000

Step 4: Load Data Page from SSD
Time: ~1ms (more data, slower)
Disk I/O: 4 total reads
Action: Retrieve complete row data
Return: {id:25, username:"alice", phone:"5551234", email:"alice@example.com"}

Total Execution Time: ~1.3 milliseconds
```

### Comparison Without Index (Full Table Scan)

```
1,000,000,000 rows (1 billion)
Average position: row 500,000,000
Disk reads needed: ~500,000,000 (one per page, 1000 rows per page = 500M pages)
Time: ~500,000 milliseconds = ~8 minutes!

B+ Tree Advantage: 8 minutes → 1.3 milliseconds = 368,000x FASTER!
```

---

## Core Truth Summary

### Why B+ Trees Dominate Database Design

```
Problem Statement:
  - Data on slow SSD
  - Need fast searches among billions of rows
  - Must support inserts/deletes efficiently

B+ Tree Solution:
  - Many keys per node (1000+)
  - One node = one disk page
  - Binary-like searching on multiple keys
  - Automatic balancing
  - Leaf linking for ranges

Result:
  1 billion row search in 3-4 disk reads
  30ms → 3ms = 10x performance improvement
```

### The Magic Formula

```
Branching Factor × Tree Balance = Constant Disk Reads

No matter if database has:
  - 1 million rows (2-3 reads)
  - 1 billion rows (3-4 reads)
  - 1 trillion rows (4-5 reads)

Search time scales logarithmically, not linearly!
```

---

## Final One-Liner

> **B+ Trees allow databases to find any record among BILLIONS of rows using only 3-5 disk operations, turning what would be minutes of searching into milliseconds.**

This is why every modern database engine (MySQL, PostgreSQL, Oracle, MongoDB, RocksDB, SQLite) uses B-Tree variants for indexing.

```



```
