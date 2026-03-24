# Mongoose

## Overview

MongoDB is schema-less by default. Mongoose makes it structured by enforcing a schema.

Mongoose is based on **ODM** (Object Data Modeling). It maps JavaScript objects to MongoDB documents and adds schema and validation.

## What is Mongoose Used For?

Mongoose is used to:

- Define schema (structure of data)
- Validate data before saving
- Interact with MongoDB easily using models
- Keep database clean and consistent

## How Mongoose Works

Mongoose adds schema to MongoDB, meaning it defines structure and datatype for documents. It also validates data and provides easy methods to interact with the database.

## Mongoose Flow Diagram

```
┌─────────────────────────────────┐
│ JavaScript Object (JSON-like)   │
│ { name: "Shreyas", age: 22 }    │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│    Mongoose (ODM)               │
│  Schema + Validation            │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│  MongoDB Driver                 │
│  JSON → BSON Conversion         │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│    MongoDB Storage              │
│ { name: "Shreyas", age: 22 }    │
│      (stored as BSON)           │
└─────────────────────────────────┘
```
