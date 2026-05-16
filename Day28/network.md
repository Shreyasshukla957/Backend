# Networking Q&A — TCP/IP, HTTP, WebSocket, Socket.IO

> Poori conversation ka summary — Q&A format mein

---

## TCP/IP vs HTTP vs WebSocket — Deep Comparison

### Sabse Pehle — Yeh Teeno Ek Doosre Se Compare Nahi Hote

Yeh teeno alag alag **layers** pe kaam karte hain. Inhe compare karna waisa hai jaise poochho:

> "Road, Car, aur GPS mein kya faraq hai?"

Teeno alag cheezein hain — ek doosre ke upar kaam karte hain, ek doosre ke against nahi.

```
┌─────────────────────────────────────────────┐
│           TUMHARA APPLICATION               │
├─────────────────────────────────────────────┤
│   WebSocket Protocol  /  HTTP Protocol      │  ← Application Layer
│   (kaise baat karein — format, rules)       │
├─────────────────────────────────────────────┤
│              TCP                            │  ← Transport Layer
│   (guarantee — data pohonchega ya nahi)     │
├─────────────────────────────────────────────┤
│              IP                             │  ← Network Layer
│   (kahan jaana hai — routing, address)      │
├─────────────────────────────────────────────┤
│         Physical — Wire / WiFi              │  ← Physical Layer
└─────────────────────────────────────────────┘
```

**TCP/IP = Foundation (neenv)**
**HTTP = Ek application jo TCP/IP pe chalti hai**
**WebSocket = Doosri application jo TCP/IP pe chalti hai**

HTTP aur WebSocket dono TCP/IP use karte hain — jaise do alag cars ek hi road use kar sakti hain.

---

### TCP/IP — Kya Hai, Kya Karta Hai

**TCP/IP ek transport system hai — data delivery ka kaam karta hai.**

Isko data ke content se bilkul koi matlab nahi. Uska ek hi kaam:

> "Yeh bytes uthao — uss machine tak pohonchao — guarantee ke saath"

```
TCP jaanta hai:            TCP nahi jaanta:
✅ Source IP               ❌ Yeh HTTP hai ya WebSocket
✅ Destination IP          ❌ Koi webpage maang raha hai
✅ Port number             ❌ User logged in hai ki nahi
✅ Packet order            ❌ Data ka matlab kya hai
✅ Delivery confirm        ❌ Request hai ya response
```

**TCP andar kaise kaam karta hai:**

```
Step 1 — Data milta hai (HTTP ya WebSocket se)
         ↓
Step 2 — Bade data ko chhote packets mein todta hai
         Packet 1: bytes 0-1460
         Packet 2: bytes 1461-2920
         Packet 3: bytes 2921-4380
         ↓
Step 3 — Har packet ko sequence number deta hai
         Packet 1: seq=1000
         Packet 2: seq=2461
         Packet 3: seq=3922
         ↓
Step 4 — Bhejta hai — alag alag routes se ja sakte hain
         ↓
Step 5 — Dusri taraf se ACK ka wait karta hai
         "Packet 1 mila" → "Packet 2 mila" → "Packet 3 mila"
         ↓
Step 6 — Koi packet nahi mila → dobara bhejta hai
         ↓
Step 7 — Dusri side pe sahi order mein jodta hai
```

**IP andar kaise kaam karta hai:**

```
Har packet pe do cheezein lagata hai:
  Source IP:      192.168.1.5   (tumhara computer)
  Destination IP: 142.250.80.46 (google.com)

Phir routers decide karte hain kaunsa rasta best hai:
  Mumbai Router  → "Dubai se bhejo"
  Dubai Router   → "London se bhejo"
  London Router  → "Direct Google server"

Har packet ka rasta alag ho sakta hai — IP ko farak nahi padta
TCP dono ends pe sab jod deta hai sahi order mein
```

**TCP/IP ka real world example:**

```
Tumne likha:  fetch('https://api.github.com')

OS ne kiya:
1. DNS se IP liya → 140.82.121.6
2. TCP 3-way handshake → connection bana
3. Data ko packets mein toda
4. Har packet pe IP address lagaya
5. Bheja
6. ACK ka wait kiya
7. Dusri taraf pe joda
8. HTTP layer tak diya
```

---

### HTTP — Kya Hai, Kya Karta Hai

**HTTP ek application protocol hai — do computers ke beech baat karne ka ek agreed format.**

TCP/IP ne data pohoncha diya — ab **kya poochha, kya jawab dena hai** — yeh HTTP decide karta hai.

```
HTTP jaanta hai:           HTTP nahi jaanta:
✅ GET, POST, PUT, DELETE  ❌ Packet kaise aaya
✅ Status codes (200, 404) ❌ Kitne hops liye
✅ Headers format          ❌ Route kya tha
✅ Request/Response cycle  ❌ Packet order
✅ URLs, paths             ❌ Retransmission
✅ Content-Type            ❌ TCP ka koi kaam
```

**HTTP andar kaise kaam karta hai:**

```
Tumne likha: fetch('/api/users')

HTTP ne banaya:
┌──────────────────────────────────────┐
│ GET /api/users HTTP/1.1              │  ← Method + Path + Version
│ Host: api.example.com                │  ← Kahan jaana hai
│ Accept: application/json             │  ← Kya chahiye
│ Authorization: Bearer token123       │  ← Kaun hai
│ Content-Type: application/json       │  ← Data type
│                                      │  ← Blank line (headers khatam)
│ { "filter": "active" }               │  ← Body (POST mein)
└──────────────────────────────────────┘
         ↓ TCP/IP ne uthaya aur pohonchaya ↓
Server ne banaya response:
┌──────────────────────────────────────┐
│ HTTP/1.1 200 OK                      │  ← Status
│ Content-Type: application/json       │  ← Response type
│ Content-Length: 245                  │  ← Size
│                                      │  ← Blank line
│ [{"id":1,"name":"Rahul"},...}]       │  ← Actual data
└──────────────────────────────────────┘
```

**HTTP ka sabse bada characteristic — Request-Response aur Stateless:**

```
Request-Response:
  Client poochhe → Server jawaab de → KHATAM
  Server khud se kabhi bhi kuch nahi bhej sakta
  Client ko poochhna padega

Stateless:
  Har request fresh hai — server ko pata nahi
  ki tumne pehle kya poochha tha
  Isliye Cookies aur Sessions ka use hota hai
  "Kaun hai yeh yaad rakhne ke liye"
```

**HTTP Status Codes — Server kya bol raha hai:**

```
1xx — Information
  100 Continue — "Theek hai, bhejte raho"

2xx — Success
  200 OK           — "Sab theek, yeh lo data"
  201 Created      — "Naya resource ban gaya"
  204 No Content   — "Ho gaya, data nahi hai"

3xx — Redirect
  301 Moved Permanently — "Woh wahan chala gaya hamesha ke liye"
  302 Found             — "Abhi ke liye wahan jao"

4xx — Client ki galti
  400 Bad Request   — "Teri request galat hai"
  401 Unauthorized  — "Pehle login kar"
  403 Forbidden     — "Permission nahi hai"
  404 Not Found     — "Yeh cheez hai hi nahi"
  429 Too Many Req  — "Itni jaldi mat kar"

5xx — Server ki galti
  500 Internal Error — "Server mein kuch gadbad"
  502 Bad Gateway    — "Aage wala server ne jawab nahi diya"
  503 Unavailable    — "Server abhi busy hai"
```

**HTTP ki fundamental limitation:**

```
Client                    Server
  |                          |
  |  Request bhejo -------->  |
  |  <-------- Response aaya  |
  |                          |
  |   Connection KHATAM      |
  |                          |
  |  Kuch naya hua server pe |
  |  Server batana chahta hai|
  |  PAR NAHI BATA SAKTA     |  ← yahi problem hai
  |                          |
  |  Client ko poochhna padega|
```

---

### WebSocket — Kya Hai, Kya Karta Hai

**WebSocket bhi ek application protocol hai — but HTTP se bilkul alag nature ka.**

HTTP = Postcard — ek bhejo, ek aaye, khatam
WebSocket = Phone Call — ek baar connect, dono taraf jab chaaho bolo

```
WebSocket jaanta hai:      WebSocket nahi jaanta:
✅ Full duplex connection   ❌ HTTP methods (GET/POST)
✅ Server push any time     ❌ Status codes (200, 404)
✅ Persistent connection    ❌ Headers per message
✅ Low overhead frames      ❌ Stateless requests
✅ Binary data              ❌ URL paths
✅ Ping/Pong heartbeat      ❌ Cookies natively
```

**WebSocket andar kaise kaam karta hai:**

```
Step 1 — HTTP se shuru (sirf ek baar)
  Client: "Bhai WebSocket pe switch karte hain?"
  GET /chat HTTP/1.1
  Upgrade: websocket
  Sec-WebSocket-Key: abc123==

Step 2 — Server maan gaya
  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Sec-WebSocket-Accept: xyz789==

Step 3 — Ab HTTP khatam — WebSocket shuru
  Same TCP connection — but ab frames mein data
  HTTP headers ab kabhi nahi jaate

Step 4 — Dono taraf se kabhi bhi data
  Client → Server : "Hello"          (2 + 5 = 7 bytes)
  Server → Client : "Hi there"       (2 + 8 = 10 bytes)
  Server → Client : "Naya message"   (bina client ke pooche)
  Client → Server : "Thanks"

Step 5 — Connection jab tak chaaho open
  Close karne ka apna protocol hai (Close frame)
  Phir TCP 4-way handshake
```

**WebSocket Frame — HTTP headers vs WebSocket overhead:**

```
HTTP har message ke saath:
  GET /messages HTTP/1.1        \
  Host: example.com              |
  Accept: application/json       |  ~600 bytes
  Cookie: session=abc123         |  sirf headers
  Authorization: Bearer token    |
  Cache-Control: no-cache       /
  + actual data

WebSocket frame:
  [2 bytes header][actual data]
  Total overhead: sirf 2-10 bytes!

1000 messages ke liye:
  HTTP:      600,000 bytes sirf headers
  WebSocket: 2,000-10,000 bytes headers
  → WebSocket 60-300x efficient
```

---

### Teeno Ka Side-by-Side Comparison

```
                    TCP/IP          HTTP            WebSocket
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kya hai         Transport       Application     Application
                Protocol        Protocol        Protocol

Kaam kya hai    Data pohonchana Req-Res format  Full duplex
                guarantee       define karna    communication

Kiske upar      IP pe           TCP/IP pe       TCP/IP pe
chalta hai

Connection      Persistent      HTTP 1.0: har   Hamesha
                TCP socket      req pe band     persistent
                                HTTP 1.1: keep-alive

Direction       Dono taraf      Client → Server Dono taraf
                (TCP level)     phir Server →   (real-time)
                                Client only

Data format     Raw bytes       Headers + Body  Lightweight
                                Text/JSON/HTML  Frames

Overhead        Minimal         400-800 bytes   2-10 bytes
                (OS handles)    per request     per message

Server push     TCP level pe    NAHI            HAAN —
                haan            (polling chahiye) kabhi bhi

State           Connection      Stateless —     Stateful —
                track karta hai har req fresh   connection open

Use case        Sab kuch        Websites, APIs, Chat, Gaming,
                transport       REST calls      Live data

Real world      Invisible —     Browser ka      WhatsApp Web,
                OS handle kare  har fetch()     Online games
```

---

### Ek Real Scenario — Teeno Ka Role

**WhatsApp Web kholne pe kya hota hai:**

```
PHASE 1 — TCP/IP ka kaam (connection banana)

Browser → OS: "web.whatsapp.com se baat karni hai"
OS → DNS: "web.whatsapp.com ka IP kya hai?"
DNS → OS: "157.240.8.60"
OS → Network: TCP 3-way handshake
  SYN → SYN-ACK → ACK
OS → Browser: "Connection ready hai"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 2 — HTTP ka kaam (page load karna)

Browser → Server: GET / HTTP/1.1 (HTML maango)
Server → Browser: 200 OK + HTML
Browser → Server: GET /app.js HTTP/1.1 (JS maango)
Server → Browser: 200 OK + JavaScript
Browser → Server: GET /style.css HTTP/1.1
Server → Browser: 200 OK + CSS
[page render hua]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 3 — WebSocket ka kaam (real-time messages)

Browser → Server: GET /ws HTTP/1.1
                  Upgrade: websocket    ← HTTP se WebSocket switch
Server → Browser: 101 Switching Protocols

[Ab HTTP nahi — WebSocket channel open]

Server → Browser: "Rahul ne message bheja: Hello!"   ← server push
Browser → Server: "Message dekh liya"
Server → Browser: "Priya online ho gayi"             ← server push
Server → Browser: "Naya group message aaya"          ← server push
Browser → Server: "Main message likh raha hoon"

[Connection open rehta hai — minutes/hours/days tak]
```

---

### Data Flow — Ek Message Ka Safar

**Tum WhatsApp Web pe "Hello" type karke Enter dabaate ho:**

```
Tumhara Browser
    |
    | socket.send("Hello")
    |
    ↓
WebSocket Layer
    |
    | Frame banao:
    | [FIN=1][opcode=text][mask=1][length=5][masking-key][Hello XOR'd]
    | Total: ~11 bytes
    |
    ↓
TCP Layer (OS)
    |
    | Packet mein daalo
    | Sequence number lagao
    | ACK ka wait karo
    |
    ↓
IP Layer (OS)
    |
    | Source IP: 192.168.1.5 (tumhara PC)
    | Dest IP:   157.240.8.60 (WhatsApp server)
    | Route decide karo
    |
    ↓
Physical Layer
    |
    | WiFi → Router → ISP → Internet → WhatsApp Data Center
    |
    ↓
WhatsApp Server IP Layer
    |
    | "Yeh mera packet hai" → upar bhejo
    |
    ↓
WhatsApp Server TCP Layer
    |
    | Reassemble, order check, ACK bhejo
    |
    ↓
WhatsApp Server WebSocket Layer
    |
    | Frame parse karo, unmask karo
    | "Hello" nikala
    |
    ↓
WhatsApp Server Application Code
    |
    | "Kisne bheja? Kisko bhejein?"
    | Recipient ka WebSocket dhundho
    | Unhe forward karo
    |
    ↓
Recipient ka WebSocket → TCP/IP → Unka Browser
    |
    ↓
"Hello" message screen pe dikhta hai
```

**Poora yeh safar — 50-200 milliseconds mein.**

---

### Ports — Teeno Kaise Alag Rehte Hain

```
IP Address = Ghar ka address    → "Andheri, Mumbai"
Port       = Flat number        → "3rd floor, 302"

Common ports:
  Port 80   → HTTP traffic
  Port 443  → HTTPS (HTTP + TLS)
  Port 8080 → Dev HTTP server
  Port 3000 → Node.js app

WebSocket bhi same ports use karta hai:
  ws://example.com   → Port 80  (HTTP upgrade)
  wss://example.com  → Port 443 (HTTPS upgrade)

Isliye WebSocket ka upgrade HTTP se hota hai —
same port pe hi rehta hai, protocol switch hota hai
```

---

### Teeno Ki Limitations — Honestly

**TCP/IP ki limitations:**
```
✗ Speed — 3-way handshake har baar (HTTP/3 ne QUIC se fix kiya)
✗ Head of Line Blocking TCP level pe (HTTP/3 ne fix kiya)
✗ Complex — OS level, directly control nahi kar sakte
✗ UDP se slow — guaranteed delivery ki cost hai
```

**HTTP ki limitations:**
```
✗ Server push nahi kar sakta (SSE partial fix, WebSocket full fix)
✗ Stateless — har request mein auth bhejni padti hai
✗ Headers heavy — 400-800 bytes overhead har request
✗ Half-duplex — ek time pe ek direction (HTTP/2 ne improve kiya)
✗ Real-time ke liye jugaad karna padta tha (polling, long-polling)
```

**WebSocket ki limitations:**
```
✗ HTTP features nahi hain — no caching, no routing by URL
✗ Reconnection manually handle karna padta hai
✗ Rooms, events, namespaces — khud banana padta hai
✗ Proxies aur firewalls kabhi kabhi block karte hain
✗ Stateful — scaling complex ho jaati hai
✗ Browser mein HTTP se zyada resources use karta hai
```

---

### Simple Memory Aid — Yaad Rakhne Ke Liye

```
TCP/IP  →  Delivery Boy
           "Main sirf deliver karta hoon"
           "Andar kya hai — mujhe nahi pata"
           "Pohoncha ya nahi — guarantee meri"

HTTP    →  Postcard System
           "Ek bhejo — ek aaye"
           "Address, content, format — sab defined"
           "Delivered? Client ko poochhna padega"

WebSocket → Phone Call
           "Ek baar connect — jab tak chaaho baat karo"
           "Dono taraf — kabhi bhi"
           "Line open — sirf close karo jab done ho"
```

---

## TCP/IP



**Q: TCP ka full form kya hai?**

TCP — Transmission Control Protocol. Aur iska pair IP — Internet Protocol hai. Isliye dono ko saath mein TCP/IP bola jaata hai.

**Q: TCP aur IP ka kaam alag alag kya hai?**

- **IP** ka kaam hai packet ko sahi jagah pohonchaana — routing aur addressing
- **TCP** ka kaam hai packet sahi order mein aur bina tute pohonchaana — reliability guarantee

Simple analogy:
- IP = address likhna envelope pe — "yahan pohonchao"
- TCP = speed post ka guarantee — "confirm karo mila ki nahi"

**Q: TCP 3-Way Handshake kya hoti hai? Connection kaise banta hai?**

```
Client → Server : SYN      "Bhai baat karni hai, mera number 100 hai"
Server → Client : SYN-ACK  "Haan, mera 200, tera 101 mila"
Client → Server : ACK       "Tera 201 mila, shuru karte hain"
```

Yeh teen steps ke baad TCP connection establish hoti hai. Har TCP connection ke liye — HTTP, WebSocket sab ke liye — yeh handshake hoti hai.

**Q: TCP 4-Way Handshake kya hoti hai? Connection kaise toot ta hai?**

```
Client → Server : FIN      "Mera kaam ho gaya, main close karunga"
Server → Client : ACK      "Theek hai, tera FIN mila"
Server → Client : FIN      "Mera bhi ho gaya, main bhi close karunga"
Client → Server : ACK      "Theek hai, bye"
```

3-way mein connection bana, 4-way mein toot ta hai. 4 steps isliye kyunki dono sides independently apna kaam khatam karke close karti hain.

**Q: 3-way aur 4-way mein faraq kyun hai — ek extra step kyun?**

- **3-way** = "Chalo baat karte hain" — dono simultaneously ready ho jaate hain
- **4-way** = "Alvida" — dono independently apna kaam khatam karke alag alag close karte hain

Connection banana ek saath hota hai, todna alag alag hota hai — isliye ek extra step.

**Q: TIME_WAIT kya hota hai?**

4-way handshake ke baad client 2 minutes wait karta hai fully close hone se pehle. Agar last ACK lost ho gayi toh server dobara FIN bhejega — client TIME_WAIT mein hai toh dobara ACK bhej sakta hai.

**Q: TCP packets alag alag routes se kaise jaate hain?**

```
Packet 1 → Mumbai → Dubai → London → Server
Packet 2 → Mumbai → Singapore → Server
Packet 3 → Mumbai → Dubai → London → Server
```

Teen packets, teen alag raste — IP routing decide karta hai. TCP dono sides pe sequence numbers use karke sab sahi order mein jodta hai.

**Q: Half-Close kya hota hai?**

TCP mein ek side close kar sakti hai bina doosri side ke close kiye. Client FIN bhejta hai — "main aur nahi bhejoonga" — but server abhi bhi data bhej sakta hai. Jab server ka bhi kaam khatam hota hai tab woh FIN bhejta hai.

---

## HTTP

**Q: HTTP aur TCP/IP mein kya faraq hai?**

Inhe compare karna waisa hai jaise poochho — "Road aur Car mein kya faraq hai?"

- **TCP/IP** = Road — guarantee ki data pohonchega
- **HTTP** = Car — kya le ja rahe ho, kaise pack kiya

HTTP runs OVER TCP/IP. TCP/IP ko data ke content se koi matlab nahi — uske liye sab sirf bytes ka stream hai. HTTP upar ek format/language hai.

```
Tumhara Code  →  HTTP  →  TCP  →  IP  →  Physical (Wire/WiFi)
```

**Q: HTTP 1.0 ki kya problem thi?**

Ek rule tha — ek request, ek response, connection band. Ek webpage mein 30 cheezein hain toh 30 baar TCP 3-way handshake hogi. Bahut wasteful — sirf connection banane mein time lag raha tha.

**Q: HTTP 1.1 mein kya badla?**

- **Persistent Connection** — ek baar connection bana, use kuch der tak open rakho
- **Pipelining** — ek ke baad ek wait kiye bina multiple requests bhejo

But ek problem rahi — **Head of Line Blocking** — responses same order mein aane chahiye jisme requests gayi thi. Pehli request slow hai toh baaki sab queue mein wait karengi.

**Q: Polling kya tha aur uski kya problem thi?**

HTTP 1.1 mein server khud se kuch nahi bhej sakta. Toh developers har X seconds mein server se poochhte the — "koi message aaya?" Isko Polling kehte hain.

Problems:
- Delay — message 3.1s pe aaya, user ko 6s tak wait karna padega
- Server pe unnecessary load — 1000 users × har 3 seconds = bahut requests
- Bandwidth waste — 999 baar "nahi" milega

**Q: Long Polling kya tha?**

Request bhejo, server tab answer de jab kuch ho. Beech mein connection open rakho. Better tha but phir bhi — har message ke baad nayi HTTP connection, server pe ek thread per connection, aur latency abhi bhi thi.

**Q: SSE — Server Sent Events kya tha?**

Ek connection kholo, server jab chahe data push karta rahe. One-way — sirf server se client. Achha tha but badi limit — client same connection pe kuch nahi bhej sakta. Chat app mein kaam nahi karta.

**Q: HTTP 2 ne kya fix kiya?**

Head of Line Blocking fix kiya — multiplexing se ek connection pe multiple streams parallel chal sakte hain. But real-time problem wahi rahi — server tab bhi khud se kuch nahi bhej sakta jab tak client pooche na.

**Q: HTTP Request ka format kaisa hota hai?**

```
GET /api/data HTTP/1.1
Host: example.com
Accept: application/json
Connection: keep-alive

[body — GET mein nahi hoti]
```

Headers ka problem — har request mein 400-800 bytes sirf headers. Agar actual data 20 bytes ka hai toh 90% bandwidth headers kha raha hai.

**Q: DNS kya karta hai — connection banane se pehle?**

Browser ko pata karna hota hai server kahan hai. DNS Resolution:
1. Cache check karo — browser, OS, router
2. Nahi mila toh DNS Server se poochho (8.8.8.8 Google ya ISP ka)
3. DNS bolta hai "api.github.com = 140.82.121.6"
4. Ab IP mila, connection banao

**Q: Connection actually kaise banta hai — OS level pe?**

OS level pe connection sirf ek **file descriptor** hai — ek number jo ek open network channel represent karta hai.

```c
// Client
int sockfd = socket(AF_INET, SOCK_STREAM, 0);  // socket banao
connect(sockfd, &server_addr, sizeof(server_addr));  // TCP handshake
write(sockfd, data, length);  // bhejo
read(sockfd, buffer, sizeof(buffer));  // paao
close(sockfd);  // band karo

// Server
int serverfd = socket(AF_INET, SOCK_STREAM, 0);
bind(serverfd, &address, sizeof(address));    // port se bind
listen(serverfd, 10);  // sunna shuru
int clientfd = accept(serverfd, ...);  // naya connection aaya
```

Node.js yeh sab chhupa leta hai — `server.listen(8080)` andar se yeh sab karta hai.

**Q: HTTPS mein TLS Handshake kya hoti hai?**

TCP ke baad TLS handshake hoti hai encryption setup ke liye:
1. Client — "mujhe yeh ciphers support hain" + random number
2. Server — "yeh cipher use karo" + Certificate (public key ke saath)
3. Client certificate verify karta hai
4. Client pre-master secret bhejta hai (server ki public key se encrypt)
5. Dono milke shared secret banate hain — ab sab encrypt hoga

---

## WebSocket

**Q: WebSocket kyun aaya — kya problem solve karta hai?**

HTTP mein server khud se data push nahi kar sakta, client ko baar baar poochna padta tha. WebSocket ne permanent two-way connection diya — dono sides se kabhi bhi data bhejo, ek baar connect ho gaye.

**Q: WebSocket Handshake kaise hota hai?**

Pehle HTTP request jaati hai special headers ke saath:

```
GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

Server respond karta hai:
```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

101 ek baar aaya — ab yeh connection HTTP nahi raha. Same TCP socket ab WebSocket protocol pe chal raha hai.

**Q: WebSocket Frame kya hota hai? HTTP se kitna efficient hai?**

WebSocket mein data frames mein jaata hai — bahut lightweight:

```
HTTP overhead:      ~600 bytes headers per message
WebSocket overhead: 2-10 bytes per frame

"Hello" message:
  HTTP:      600 + 5 = 605 bytes
  WebSocket: 2 + 5   = 7 bytes
  → 90x better efficiency!
```

**Q: Masking kya hoti hai WebSocket mein?**

Client se server ka data always masked hota hai — cache poisoning attacks se bachne ke liye. 4-byte masking key se XOR operation hoti hai. Server unmask karta hai same XOR se.

**Q: WebSocket ReadyState kya hote hain?**

```
0 — CONNECTING  : connect ho raha hai
1 — OPEN        : connected, use kar sakte ho
2 — CLOSING     : close ho raha hai
3 — CLOSED      : closed
```

Production mein hamesha `readyState === WebSocket.OPEN` check karo before sending.

**Q: WebSocket mein Heartbeat kyun zaroori hai?**

Agar network cut ho jaaye toh server ko pata nahi chalta connection dead ho gayi. Heartbeat mein server har 30s mein ping bhejta hai — client automatically pong bhejta hai. Agar pong nahi aaya toh connection terminate karo.

**Q: WebSocket aur HTTP ke close mein kya faraq hai?**

```
WebSocket Close:     Pehle WebSocket close frame (opcode 0x8) exchange hota hai
                     Phir TCP 4-way handshake
                     → 2 level close

HTTP Close:          Sirf TCP 4-way handshake
                     → 1 level close
```

**Q: WebSocket ki kya limitations hain?**

- Reconnection manually likhni padti hai
- Rooms/Namespaces built-in nahi hain — khud banao
- Named events nahi hain — sirf raw data, khud switch-case likhna padta hai
- Purane browsers mein kaam nahi karta — fallback nahi hai
- Scaling ke liye extra kaam — multiple servers pe manually handle karna padta hai

---

## Socket.IO

**Q: Socket.IO kya hai — WebSocket se kaise alag hai?**

Socket.IO ek library hai jo WebSocket ke upar bani hai. WebSocket ek low-level protocol hai, Socket.IO uske upar convenience features add karta hai.

```
Tumhara Code
    ↓
Socket.IO API
    ↓
Engine.IO (transport layer)
    ↓
WebSocket ya Long Polling
    ↓
TCP/IP
```

**Q: Socket.IO ka connection kaise banta hai?**

1. Pehle Long Polling se shuru hota hai
2. Session ID milta hai server se
3. WebSocket upgrade try karta hai
4. Probe — test karo WebSocket kaam kare
5. Agar haan — polling band, WebSocket pe switch
6. Agar nahi — polling pe hi rehta hai, user ko pata bhi nahi chalta

**Q: Socket.IO ke kya fayde hain WebSocket ke upar?**

| Feature | WebSocket | Socket.IO |
|---|---|---|
| Reconnection | Khud likho | Automatic |
| Rooms | Khud banao | Built-in |
| Namespaces | Nahi | Built-in |
| Named Events | Nahi | Built-in |
| Acknowledgements | Nahi | Built-in |
| Fallback | Nahi | Long Polling |
| Broadcast | Manual loop | Built-in |
| Middleware | Nahi | Built-in |
| Binary Support | Haan | Haan |

**Q: Socket.IO Namespaces kya hote hain?**

Ek hi server pe alag alag sections — sirf us namespace ke users ek doosre se baat kar sakte hain.

```javascript
const chatNS  = io.of('/chat');   // sirf chat users
const adminNS = io.of('/admin');  // sirf admins
const gameNS  = io.of('/game');   // sirf game players
```

Network pe dono namespaces **ek hi TCP connection** share karte hain — Socket.IO andar se multiplexing karta hai.

**Q: Socket.IO Rooms kya hote hain?**

Namespace ke andar groups — `socket.join('room-name')` ek line mein. Phir `io.to('room').emit()` se sirf us room ko message.

```
Server
  └── Namespace: /chat
        ├── Room: "cricket-fans"  (Rahul, Amit, Priya)
        ├── Room: "bollywood-fans" (Sneha, Rohan)
        └── Room: "socket_1"  ← har socket ka apna room (private messaging)
```

**Q: Socket.IO Acknowledgements kya hote hain?**

Client confirm karna chahta hai ki message server tak pohoncha — callback se:

```javascript
socket.emit('message', { text: 'Hello' }, (response) => {
  if (response.status === 'ok') {
    console.log('Message deliver hua:', response.messageId);
  }
});
```

Server callback call karta hai — client ko confirmation milti hai. WebSocket mein yeh nahi hota.

**Q: Socket.IO reconnect pe socket.id kyun badalta hai?**

Har nayi connection pe server naya ID assign karta hai. Isliye users ko socket.id se nahi, apne userId se track karo database mein.

**Q: Multiple servers pe Socket.IO kaise scale karta hai?**

Redis Adapter se — sab servers ek hi Redis se baat karte hain. Server1 Redis pe publish karta hai, Server2 receive karta hai — user B tak message pohonch jaata hai chahe woh kisi bhi server pe ho.

---

## Poora Evolution — Ek Nazar Mein

```
1996  HTTP 1.0      Ek request → ek response → connection band
1997  HTTP 1.1      Persistent connection, pipelining
2000s Polling       Har X seconds mein poochho — wasteful
2006  Long Polling  Server tab reply kare jab data ho
2009  SSE           Server push — but sirf one-way
2011  WebSocket     Full duplex, persistent, dono taraf
2010+ Socket.IO     WebSocket + reconnection + rooms + events
2015  HTTP/2        Multiplexing — parallel streams
2022  HTTP/3 (QUIC) UDP pe, faster connection
```

**WebSocket real-time ka king hai — HTTP/2 aur HTTP/3 ke baad bhi.**

---

## Kab Kya Use Karein

| Situation | Technology |
|---|---|
| Simple website, no real-time | HTTP fetch/axios |
| Server sirf push kare (live scores) | SSE |
| Full duplex, simple use case | Raw WebSocket |
| Production chat, gaming, collaboration | Socket.IO |
| Multiple servers, scaling | Socket.IO + Redis Adapter |

**Rule of thumb** — Production app bana rahe ho? Socket.IO lo. Sirf jab use case bahut specific ya performance critical ho tab raw WebSocket.