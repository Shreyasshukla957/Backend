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

## Summary (What Your Diagram Really Shows)

- ✅ How logical data becomes physical bytes
- ✅ Why indexes are mandatory
- ✅ Why trees dominate databases
- ✅ Why SSD writes are expensive
- ✅ Why updates are not simple overwrites
- ✅ Why balanced structures matter

> **Note**: This is NOT beginner-level DBMS. This is real system design thinking.
