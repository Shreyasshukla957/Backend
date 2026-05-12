# MCP (Model Context Protocol) — Deep Revision with Diagrams

---

## 1. Problem — LLM ki limitation

Jab tum AI se poochte ho —

> *"Aaj Mumbai mein weather kaisa hai?"*
> AI → *"Mujhe nahi pata, mera knowledge cutoff 2024 hai"* 😐

**Kyun?** Kyunki AI sirf **text predict** karta hai.
Uske paas koi real world connection nahi hai — na internet, na database, na live data.

```
User
  |
  | "Mumbai ka weather?"
  v
 LLM
  |
  | ❌ no internet
  | ❌ no database
  | ❌ no live data
  v
"Mujhe nahi pata"
```

Yeh ek fundamental limitation hai — LLM sirf jo training data mein tha wahi jaanta hai.
Real world se koi connection nahi!

---

## 2. MCP kya hai?

**MCP = Model Context Protocol**

Anthropic ne yeh protocol design kiya taaki AI ko real world tools se connect kiya ja sake —
ek **standardised** aur **universal** way mein.

```
User
  |
  | question
  v
 LLM (MCP Client)
  |
  | tool call
  v
MCP Server
  |
  | real API hit
  v
Real World Data
  |
  | result
  v
MCP Server
  |
  | result wapas
  v
 LLM
  |
  | formatted response
  v
User
```

> **Standardised** matlab — har tool ka ek fixed format hota hai.
> Koi bhi AI, koi bhi tool use kar sakta hai — same format se!

---

## 3. Real life analogy

Socho AI ek **bahut smart employee** hai —
Jo sab kuch jaanta hai — history, science, math, coding — sab!

But uske paas koi bhi cheez nahi hai —

```
Smart Employee (AI)
  |
  | ❌ no phone
  | ❌ no internet
  | ❌ no calculator
  | ❌ no files
  v
Kuch bhi real world se nahi kar sakta!
```

Ab tum usse ek **toolbox** dete ho —

```
Toolbox (MCP)
  |
  |-- Calculator tool
  |-- Internet access tool
  |-- File reader tool
  |-- Database tool
  |-- Weather API tool
  v
Ab employee real world se kaam kar sakta hai!
```

MCP basically yahi toolbox hai — ek **standard format** mein!

---

## 4. Tumhara own insight — Cricket Score Tool

Tumne khud derive kiya tha ki agar cricket score poochna ho toh tool kaisa dikhega —

> *"get_cricket_score krke shayad tool hoga jo input shayad match kaa naam lele teamA v/s teamB aur league ka jaise IPL?"*

Aur yeh bilkul sahi tha! —

```
get_cricket_score
  |
  |-- teamA: "MI"      → user ne "MI vs CSK" likha
  |-- teamB: "CSK"     → AI ne extract kiya automatically
  |-- league: "IPL"    → user ne "IPL" mention kiya
  v
cricket API hit hoti hai → real score aata hai
```

> **Key learning** — Tool ka naam aur params **use case se naturally derive** hote hain!
> Tumne pehli baar mein exactly sahi socha — yahi natural thinking hai!

---

## 5. Tool definition object — Exact Shape

Yeh MCP ka **sabse important concept** hai.

Har tool ka ek fixed shape hota hai jisse AI —
- Samjhe tool kya karta hai
- Samjhe kya input dena hai
- Decide kare kab use karna hai

### Exact shape —

```javascript
{
    name: "tool_name",
    description: "AI isko padhke decide karta hai kab use karna hai",
    inputSchema: {
        type: "object",
        properties: {
            param1: {
                type: "string",
                description: "is param ka kaam kya hai"
            },
            param2: {
                type: "number",
                description: "is param ka kaam kya hai"
            }
        },
        required: ["param1"]
    }
}
```

### Har field ka kaam —

```
name
  |-- tool ka unique identifier
  |-- AI is naam se tool ko call karta hai
  |-- example: "get_weather", "get_cricket_score"

description
  |-- AI sirf yeh padhke decide karta hai kab tool use karna hai
  |-- jitna clear description, utna better AI decision
  |-- example: "Gets live cricket score for a match"

inputSchema
  |-- type: always "object"
  |-- properties
  |     |-- har ek input param define hota hai
  |     |-- type: string / number / boolean
  |     |-- description: AI user message se yeh value extract karne ke liye padhta hai
  |-- required
        |-- konse params bina nahi chal sakta tool
        |-- missing ho toh AI puchega user se
```

### Real examples — same skeleton, alag params

```
get_weather
  |-- city: string (required)

get_cricket_score
  |-- teamA: string (required)
  |-- teamB: string (required)
  |-- league: string (required)

send_email
  |-- to: string (required)
  |-- subject: string (required)
  |-- body: string (required)

get_stock_price
  |-- stockName: string (required)
  |-- exchange: string (optional)
```

> **Key insight** — Format bilkul same hai sabka!
> Sirf `name`, `description` aur `properties` change hoti hain.
> Yahi MCP ka standardised interface hai!

---

## 5. Connection with Gemini's `contents` key

Jab tu Gemini ko chat history bhejta tha —

```javascript
contents: [
    { role: "user", parts: [{ text: "what is gravity?" }] },
    { role: "model", parts: [{ text: "gravity is a force..." }] },
    { role: "user", parts: [{ text: "explain simply" }] },
]
```

Aur MCP tool definition —

```javascript
{
    name: "get_weather",
    description: "Gets current weather",
    inputSchema: {
        properties: {
            city: { type: "string", description: "city name" }
        }
    }
}
```

Dono mein **same cheez** ho rahi hai —

```
Gemini contents
  |
  |-- Fixed shape → role, parts, text
  |-- AI ko batata hai → conversation history kya hai
  |-- Purpose → AI sahi context se jawab de

MCP tool definition
  |
  |-- Fixed shape → name, description, inputSchema
  |-- AI ko batata hai → tool kya karta hai, kya input chahiye
  |-- Purpose → AI sahi tool sahi inputs ke saath call kare

Common cheez
  |
  |-- Dono structured format mein hain
  |-- Dono AI ko context dete hain
  |-- Dono ka ek fixed shape hai jo change nahi hota
  v
Standardised interface — AI ko sahi decision lene mein help karta hai!
```

---

## 6. MCP Architecture — Client aur Server

MCP mein do main parts hote hain —

```
MCP Client
  |-- Jo tool use karna chahta hai
  |-- Claude, Gemini, GPT — ya tumhara backend
  |-- MCP Server se connect karta hai
  |-- Tool call bhejta hai, result leta hai

MCP Server
  |-- Jahan saare tools define aur hosted hain
  |-- Tool call receive karta hai
  |-- Real API hit karta hai
  |-- Result wapas client ko deta hai
```

### Multiple MCP Servers ek saath —

```
MCP Client (AI / Backend)
  |
  |-- MCP Server 1 (Weather tools)
  |     |-- get_weather
  |     |-- get_forecast
  |
  |-- MCP Server 2 (Cricket tools)
  |     |-- get_cricket_score
  |     |-- get_player_stats
  |
  |-- MCP Server 3 (Gmail tools)
  |     |-- send_email
  |     |-- read_inbox
  |
  |-- MCP Server 4 (Database tools)
        |-- read_data
        |-- write_data
```

> Ek AI ek saath **multiple MCP servers** se connected ho sakta hai!
> Matlab hazaron tools available — ek hi AI ke paas!

---

## 7. MCP Client aur Server — Tumhari own clarity

Tumne conversation mein ek important cheez khud clear ki thi —

> *"MCP client tum, Gemini aur GPT ho aur MCP server ek jagah par rakha hua server h jisse tum context provide krke realtime data le sakte ho"*

Yeh bilkul sahi definition hai! —

```
MCP Client = Claude / Gemini / GPT
  |
  | yeh jo bhi AI hai woh client hai
  | tools use karna chahta hai
  | MCP server se connect karta hai
  v

MCP Server = Ek alag server
  |
  | tools yahan hosted hain
  | real world APIs yahan se hit hoti hain
  | context lekar real time data deta hai wapas
  v

Real World Data
```

> **Simple way to remember** —
> Client = jo maangta hai (AI)
> Server = jo deta hai (tools ka ghar)

---

## 8. Transport Layer

Transport layer define karta hai —
**MCP Client aur MCP Server ke beech communication kaise hogi!**

Do tarike hain —

### stdio — Same machine

```
Tumhara Laptop
  |
  |-- MCP Client (Claude Desktop / tumhara app)
  |       |
  |       | direct input/output
  |       | same process
  |       v
  |-- MCP Server (locally running)
```

- Dono **same machine** pe hain
- Direct communication — jaise terminal mein input/output
- Fast aur simple
- Use case — local development, Claude Desktop pe local tools

### SSE (Server Sent Events) — Remote server

```
Tumhara Laptop                    Cloud Server
  |                                     |
  |-- MCP Client                   MCP Server
  |       |                             |
  |       |-------- HTTP request ------>|
  |       |                             |
  |       |<------- SSE stream ---------|
  |       |   (open connection,         |
  |       |    data aata rehta hai)     |
```

- Dono **alag machines** pe hain
- HTTP ke through communication
- SSE — ek baar connection banta hai, server continuously data bhej sakta hai
- Jaise YouTube pe video stream hoti hai
- Use case — production, deployed MCP servers

```
Summary
  |
  |-- Same machine → stdio
  |-- Remote server → SSE over HTTP
```

---

## 8. AI internally tool invoke kaise karta hai — Step by step

Yeh poora internal flow hai jab user kuch poochta hai —

```
Step 1 — User question
  |
  | "IPL mein MI vs CSK ka score kya hai?"
  v

Step 2 — AI ko tool definitions milti hain
  |
  | tools: [
  |     { name: "get_cricket_score", description: "...", inputSchema: {...} },
  |     { name: "get_weather", description: "...", inputSchema: {...} }
  | ]
  v

Step 3 — AI decide karta hai
  |
  | "user ne cricket score pucha hai"
  | "get_cricket_score tool use karna chahiye"
  v

Step 4 — AI pehle se bana format uthata hai
  |
  | inputSchema se format uthaya:
  | { teamA: ?, teamB: ?, league: ? }
  |
  | user ke message se values extract ki:
  | teamA: "MI", teamB: "CSK", league: "IPL"
  v

Step 5 — AI tool_use object ready karta hai
  |
  | {
  |     type: "tool_use",
  |     name: "get_cricket_score",
  |     input: {
  |         teamA: "MI",
  |         teamB: "CSK",
  |         league: "IPL"
  |     }
  | }
  v

Step 6 — MCP Client yeh MCP Server ko bhejta hai
  |
  | Client → Server: "get_cricket_score execute karo"
  v

Step 7 — MCP Server real API hit karta hai
  |
  | async function get_cricket_score({ teamA, teamB, league }) {
  |     const data = await cricketAPI.getScore(teamA, teamB, league)
  |     return data
  | }
  |
  | result: "MI: 185/4 (18.2 ov)"
  v

Step 8 — Result wapas AI ko jaata hai (Round 2)
  |
  | AI ke paas ab hai:
  | 1. Original question — "MI vs CSK ka score?"
  | 2. Tool result — "MI: 185/4 (18.2 ov)"
  v

Step 9 — AI final response banata hai
  |
  | "IPL mein MI abhi 185/4 pe hai 18.2 overs mein CSK ke against!"
  v

Step 10 — User ko response milta hai
```

### Important conversation insight — "generates" vs "fills"

Tumne ek important correction kiya tha —

```
Maine kaha tha →
  "AI generates tool_use object"

Tumne correct kiya →
  "Saare tool ka ek hi format h aur AI ko pata h kaunsa tool use krna h
   toh woh tool jo h usko choose/call krta phir uske andar data bhar deta
   aur usse server par bhejdeta"
```

Aur tum **bilkul sahi the!**

```
"generates" matlab — naya banata hai   ❌ wrong word
"fills"     matlab — pehle se bana     ✅ correct word
            format mein data bharta hai
```

> Maine galat word use kiya tha — sahi word hai **"fills"**
> AI tool_use object **fills** karta hai, **generates/creates** nahi karta!

---

```
Tool definition mein pehle se format defined hai
  |
  | inputSchema: { teamA, teamB, league }
  v
AI ne yeh format nahi banaya
  |
  | AI ne sirf user ke message se values extract ki
  | aur us pehle se bane format mein daal di
  v
Bilkul jaise ek printed form hota hai
  |
  | form pehle se printed — tumne nahi banaya
  | tum sirf naam, address fill karte ho
  v
AI bhi wahi karta hai — fills, not creates!
```

---

## 10. Kitne LLM involved hote hain?

### Tumhara original thought

Tumne pehle socha tha —

> *"there are 2 llm models involved in this. one llm models understand the content through user input and gives the relative tool name to the backend and than the backend checks the tool name and call the api mentioned in the tool name and gives the result and the user data to the mcp client"*

Yeh thought **almost sahi tha** — sirf ek correction tha!

```
Tumhara thought
  |
  | 2 LLM models involved hain ← yeh part galat tha
  | LLM 1 → tool name decide karta hai ← yeh sahi tha!
  | Backend → tool call execute karta hai ← yeh sahi tha!
  | Result + user data → MCP client ko jaata hai ← yeh sahi tha!
  v

Actual answer
  |
  | 2 LLM nahi — 1 LLM, 2 rounds!
  | Baaki poora flow tumhara exactly sahi tha!
```



### Standard MCP — 1 LLM, 2 Rounds

```
Round 1
  |
  | LLM user input padhta hai
  | tool definitions padhta hai
  | decide karta hai — get_cricket_score
  | inputs fill karta hai — MI, CSK, IPL
  | tool_use object return karta hai
  v

Backend/Client tool execute karta hai
  |
  | MCP Server pe function run hota hai
  | real cricket API hit hoti hai
  | result aata hai — "MI: 185/4"
  v

Round 2 — Same LLM
  |
  | original question padhta hai
  | tool result padhta hai
  | final human readable response banata hai
  v

User ko answer milta hai
```

> **Confirmed** — Google Cloud docs ke mutabik same LLM do rounds mein kaam karta hai.
> Pehle tool decide, phir result se final response.

### AI Agents mein — 2 LLMs possible

```
User complex task deta hai
  |
  | "Analyze today's IPL match and write a detailed report"
  v

LLM 1 — Orchestrator (Manager)
  |
  | decide karta hai kya karna hai
  | "pehle score fetch karo"
  | "phir analysis karo"
  v

Tool execute — get_cricket_score
  |
  | score aata hai
  v

LLM 2 — Specialist (Worker)
  |
  | sirf analysis aur report writing karta hai
  | score data lekar detailed report banata hai
  v

Final detailed report user ko milti hai
```

```
Comparison
  |
  |-- Standard MCP
  |     |-- 1 LLM
  |     |-- 2 rounds
  |     |-- Simple tasks
  |
  |-- AI Agents
        |-- Multiple LLMs
        |-- LLM 1 = Manager/Orchestrator
        |-- LLM 2 = Specialist Worker
        |-- Complex multi-step tasks
```

---

## 10. Architecture — LLM context vs Tumhara Backend

### Scenario 1 — LLM directly as MCP Client

Jab Claude, Gemini, GPT seedha MCP server se baat karte hain —

```
User
  |
  | question
  v
Claude / Gemini / GPT
(MCP Client + Decision Maker)
  |
  | tool call
  v
MCP Server
  |
  | real API
  v
Real World Data
  |
  | result
  v
Claude / Gemini / GPT
  |
  | final response
  v
User
```

> Yahan **LLM khud MCP client hai** — directly server se baat karta hai!

---

### Scenario 2 — Tumhara Architecture (Frontend + Backend + Gemini + MCP)

Jab tumhara apna backend beech mein hota hai —

```
User
  |
  | message type karta hai
  v
Frontend (React / HTML)
  |
  | HTTP POST /chat
  v
Backend (Node.js + Express)
  |
  | msg + history lekar
  | Gemini ko bhejta hai
  v
Gemini — Round 1
  |
  | tool definitions padhta hai
  | decide karta hai kaunsa tool
  | tool_use object return karta hai
  v
Backend
  |
  | tool_use object receive kiya
  | tool name check kiya
  | MCP Server pe route kiya
  v
MCP Server
  |
  | tool execute kiya
  | real API hit ki
  v
Real World API (Weather / Cricket)
  |
  | real data return kiya
  v
MCP Server
  |
  | result backend ko diya
  v
Backend
  |
  | result + original question
  | Gemini ko diya
  v
Gemini — Round 2
  |
  | final response banaya
  v
Backend
  |
  | response frontend ko bheja
  v
Frontend
  |
  | user ko dikhaya
  v
User — answer milgaya!
```

### Key difference — ek line mein

```
Scenario 1 — LLM context
  |
  | LLM = MCP Client + Decision Maker
  | Backend = exist hi nahi karta

Scenario 2 — Tumhara architecture
  |
  | LLM = sirf Decision Maker
  | Backend = MCP Client ban jaata hai
  | Responsibility shift — LLM se Backend pe!

Baaki sab same —
  |-- Tool definition shape same
  |-- Tool invoke process same
  |-- Real API hit same
  |-- Sirf client kaun hai woh change hua!
```

---

## 11. MCP ke uses

```
MCP tools se AI yeh sab kar sakta hai
  |
  |-- 🌤️  Weather API
  |         real time weather fetch karna
  |
  |-- 🏏  Cricket API
  |         live match scores, player stats
  |
  |-- 🗄️  Database
  |         data read/write karna
  |
  |-- 📁  File System
  |         files padhna, likhna, delete karna
  |
  |-- 📧  Gmail
  |         emails padhna, bhejna
  |
  |-- 🔍  Web Search
  |         internet pe search karna
  |
  |-- 📊  Google Sheets
  |         spreadsheet data fetch, update
  |
  |-- 🗓️  Calendar
  |         events dekhna, schedule banana
  |
  |-- 💳  Payment APIs
              payments process karna
```

---

## 12. Benefits

```
Standardised
  |-- Ek hi format, har AI har tool use kar sakta hai
  |-- Claude ka tool Gemini bhi use kar sakta hai
  |-- No custom integration needed

Modular
  |-- Naya tool add karo bina AI ko retrain kiye
  |-- Ek tool hatao, baaki sab chalta rahe
  |-- Plug and play!

Powerful
  |-- AI sirf text predictor nahi raha
  |-- Real world se interact kar sakta hai
  |-- Live data, real actions!

Secure
  |-- Tools defined hain — AI kuch bhi random nahi kar sakta
  |-- Sirf defined tools hi use ho sakte hain
  |-- No unexpected behaviour
```

---

## 13. Quick revision — sab ek jagah

```
MCP kya hai?
  |-- AI ko real world tools se connect karna
  |-- Standard format mein

Tool definition shape?
  |-- name, description, inputSchema
  |-- same shape — har tool ke liye

AI kya karta hai?
  |-- pehle se bana format uthata hai
  |-- user message se values extract karta hai
  |-- format mein daal deta hai (fills, not creates!)

Kitne LLM?
  |-- Standard MCP → 1 LLM, 2 rounds
  |-- AI Agents → multiple LLMs

Transport?
  |-- Same machine → stdio
  |-- Remote → SSE over HTTP

Client vs Server?
  |-- Client → jo tool use karta hai (AI ya tumhara backend)
  |-- Server → jahan tools hosted hain

Tumhara architecture mein?
  |-- LLM = sirf decision maker
  |-- Backend = MCP client
  |-- Responsibility shift LLM se Backend pe!
```

---

*MCP Revision Complete — Ab rate limiting pe chalte hain! 🚀*