# Normalization in SQL

## 1. What is Normalization?

Normalization is the process of organizing data to reduce duplication and improve consistency.

**Simple Idea:**
Store each fact only once and reference it when needed.

### Example:

- ❌ Bad: Rahul's email stored 10 times
- ✅ Good: Rahul's email stored once

## 2. Why Normalization is Used

1. Avoids duplicate data
2. Makes updates easy
3. Prevents inconsistent values
4. Saves storage space

### Example:

**If email changes:**

- Without normalization → update many rows
- With normalization → update one row

## 3. Before Normalization (Problem)

Amazon-like order data in ONE table:

### Orders (Not Normalized)

| OrderID | Name  | Email           | Product |
| ------- | ----- | --------------- | ------- |
| 101     | Rahul | rahul@gmail.com | iPhone  |
| 102     | Rahul | rahul@gmail.com | AirPods |

**Problem:** Name and Email are repeated for every order

## 4. After Normalization (Solution)

Data is split into TWO related tables.

### 4.1 Customers Table

| CustomerID | Name  | Email           |
| ---------- | ----- | --------------- |
| 1          | Rahul | rahul@gmail.com |

**Notes:**

- `CustomerID` = Primary Key
- One row per customer

### 4.2 Orders Table

| OrderID | CustomerID | Product |
| ------- | ---------- | ------- |
| 101     | 1          | iPhone  |
| 102     | 1          | AirPods |

**Notes:**

- `CustomerID` = Foreign Key
- Links order to customer

## 5. Relationship Diagram

```
Customers
├─ CustomerID (PK)
│     ↓ (1)
│     │
│     ↓ (FK)
│
Orders
├─ OrderID | CustomerID
│  101     │     1
│  102     │     1
```

## 6. Why This is Better

1. No duplicate customer data
2. Easy email updates
3. Clean and logical structure

### Example:

Change email → update Customers table only

## 7. When to Use Normalization

**Use when:**

- Data has relationships
- Data updates are frequent
- Consistency matters

**Avoid heavy normalization when:**

- Reporting systems
- Analytics dashboards

## 8. One-Line Summary

**Normalization** = split related data into tables so each piece of information is stored once.
