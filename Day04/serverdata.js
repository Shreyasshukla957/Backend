// Client kya hota hai?

// 👉 Client wo hota hai jo request bhejta hai

// Examples:
// Browser (Chrome, Firefox)
// Mobile app
// Postman
// Frontend React app

// 📌 Tum jab:
// website open karte ho
// button click karte ho
// form submit karte ho
// 👉 Client request bhej raha hota hai

// 🔹 Server kya hota hai?
// 👉 Server wo hota hai jo request receive karta hai aur response deta hai

// Server ka kaam:
// Data store karna (DB)
// Logic chalana
// Authentication
// Response bhejna (JSON / HTML)

// 📌 Server hamesha wait mode mein hota hai.


// Real-life example (Restaurant 🍽️)
// You (Client) → Order dete ho
// Waiter (Internet) → Order le jaata hai
// Kitchen (Server) → Khana banata hai
// Waiter → Khana laata hai

// 1️⃣ Client request bhejta hai (GET /login)
// 2️⃣ Internet ke through request jaati hai
// 3️⃣ Server request receive karta hai
// 4️⃣ Server logic chalata hai
// 5️⃣ Server response bhejta hai
// 6️⃣ Client response ko UI mein dikhata hai


// Client: username & password bhejta hai
// Server: check karta hai DB mein
// Server: response deta hai (success / fail)
// Client: UI update karta hai
 
// 🔹 Server = Machine + Software (internal working samjho)

// ===============================
// 1️⃣ MACHINE LEVEL (Hardware)
// ===============================

// Server ek physical ya virtual machine hoti hai
// Iske paas hota hai:
// - CPU  → instructions execute karta hai
// - RAM  → temporary data hold karta hai
// - Disk → permanent data (DB, files)
// - Network Card → internet se baat karta hai

// Ye machine 24/7 ON rehti hai
// thousands / millions clients ki request handle kar sakti hai


// ===============================
// 2️⃣ OPERATING SYSTEM (OS)
// ===============================

// Machine ke upar OS chalta hai (Linux mostly)
// OS ka kaam:
// - process manage karna
// - memory allocate karna
// - network ports handle karna
// - security provide karna

// OS hi decide karta hai:
// kaunsa program kab CPU use karega


// ===============================
// 3️⃣ SERVER SOFTWARE (Runtime / Web Server)
// ===============================

// OS ke upar server software run hota hai
// jaise:
// - Node.js
// - Apache
// - Nginx
// - Django

// Ye software:
// - network port (ex: 80, 443, 3000) pe listen karta hai
// - client request ka wait karta hai


// ===============================
// 4️⃣ CLIENT REQUEST AATI HAI
// ===============================

// Client (browser / app) request bhejta hai:
// ex: GET /login

// Request internet se hoti hui:
// → Network Card
// → OS
// → Server software ke paas pahunchti hai


// ===============================
// 5️⃣ REQUEST PROCESSING
// ===============================

// Server software request ko padhta hai
// decide karta hai:
// - static file chahiye?
// - API call hai?
// - authentication chahiye?

// Agar data chahiye:
// → Database server se baat hoti hai
// → ya cache (Redis) se data uthta hai


// ===============================
// 6️⃣ RESPONSE BANANA
// ===============================

// Server logic complete hone ke baad
// response banata hai:
// - status code (200, 404, 500)
// - data (HTML / JSON)

// Response OS ko deta hai
// OS network ke through client ko bhej deta hai



// ===============================
// 7️⃣ CLIENT SIDE
// ===============================

// Client response receive karta hai
// Browser UI render karta hai
// App user ko output dikhata hai


// ===============================
// 8️⃣ LOCALHOST CASE
// ===============================

// Tumhara laptop bhi server ban sakta hai
// jab tum Node.js app run karte ho

// Laptop (machine)
// + OS (Windows / Linux)
// + Node.js (server software)
// + Express app (logic)
// = Working Server


// ===============================
// 🔥 FINAL DEEP SUMMARY
// ===============================

// Server koi ek cheez nahi hoti
// Server ek complete SYSTEM hota hai

// Machine → power deta hai
// OS → manage karta hai
// Server software → request handle karta hai
// Application logic → kaam karta hai
// Database → data deta hai

// Sab milkar client ko response dete hain

// ----------------------------------------------

// Server ek machine / software hota hai jo client ki request sunta hai

// 1️⃣ Client request bhejta hai (browser / app se)
//    jaise: GET /login , POST /data
// 2️⃣ Request internet ke through server tak jaati hai
//    (HTTP / HTTPS protocol use hota hai)
// 3️⃣ Server request receive karta hai
//    aur decide karta hai kis type ka kaam hai
//    (static file, API, auth, etc.)
// 4️⃣ Agar data chahiye:
//    server database se baat karta hai
//    ya cache server se data uthata hai
// 5️⃣ Server business logic chalata hai
//    (validation, calculation, permission check)
// 6️⃣ Server response banata hai
//    (HTML / JSON / status code)
// 7️⃣ Response client ko wapas bhej deta hai
// 8️⃣ Client response receive karta hai
//    aur UI mein data display karta hai
// 🔥 Summary:
// Client request karta hai
// Server process karta hai
// Server response deta hai


// --------------------------------------------

// 👉 Server ka IP address us MACHINE ka hota hai jahan website host hai
// Website sirf ek naam hai, IP address server machine ka hota hai.
// Website: google.com
// DNS resolve → 142.250.xxx.xxx
// 1️⃣ Tum browser mein likhte ho: google.com
// 2️⃣ Browser DNS se poochta hai:
//     "iss website ka IP address kya hai?"
// 3️⃣ DNS bolta hai:
//     "yeh lo server ka IP address 142.250.xxx.xxx"
// 4️⃣ Browser us IP pe request bhejta hai
// 5️⃣ Server (machine) request handle karta hai
// 6️⃣ Response wapas bhejta hai

// -------------------------------------------

// 🔹 Socket kya hota hai?

// Socket ek COMMUNICATION ENDPOINT hota hai
// jiske through client aur server baat karte hain

// Simple words mein:
// IP batata hai "kaunsi machine"
// Port batata hai "machine ke andar kaunsa program"
// IP + Port = Socket


// ===============================
// 1️⃣ IP ADDRESS kya karta hai?
// ===============================

// IP address identify karta hai:
// "Kaunsi machine / server se baat karni hai"

// Example:
// Server IP → 142.250.xxx.xxx


// ===============================
// 2️⃣ PORT kya karta hai?
// ===============================

// Ek server machine par multiple programs chal sakte hain
// har program ek PORT pe listen karta hai

// Examples:
// 80   → HTTP (website)
// 443  → HTTPS
// 3000 → Node.js app
// 27017 → MongoDB


// ===============================
// 3️⃣ SOCKET = IP + PORT
// ===============================

// Example socket:
// 142.250.xxx.xxx:443

// Matlab:
// → iss IP wali machine
// → iss PORT wale program se baat karo


// ===============================
// 4️⃣ Client–Server Socket Flow
// ===============================

// 1️⃣ Client browser request bhejta hai
// 2️⃣ Browser socket create karta hai:
//     (Client IP : random port) → (Server IP : server port)
// 3️⃣ Server socket accept karta hai
// 4️⃣ Dono ke beech data exchange hota hai
// 5️⃣ Response aata hai
// 6️⃣ Socket close ho jaata hai (HTTP case)


// ===============================
// 5️⃣ Ek real example
// ===============================

// Tum likhte ho:
// https://example.com

// Internally:
// DNS → Server IP
// Browser → socket banata hai:
// (YourIP:54321) → (ServerIP:443)
// Data send/receive hota hai


// ===============================
// 6️⃣ HTTP vs WebSocket
// ===============================

// HTTP socket:
// request → response → socket close ❌

// WebSocket:
// socket open rehta hai ✅
// real-time data aata rehta hai
// (chat app, live stock price)


// ===============================
// 7️⃣ Kya socket software hai?
// ===============================

// ❌ Nahi
// Socket OS-level concept hai
// OS hi socket create, manage aur close karta hai


// ===============================
// 🔥 FINAL SUMMARY
// ===============================

// IP → kaunsi machine
// Port → kaunsa program
// Socket → dono ko jodne ka rasta

// Client aur Server bina socket ke
// kabhi baat hi nahi kar sakte


// Working in Depth 

// ===============================
// 🌐 HTTP WEBSITE VISIT – FULL INTERNAL FLOW
// ===============================

// SCENARIO:
// User browser mein likhta hai:
// http://example.com
// (yahan port explicitly mention nahi kiya gaya)



// ===============================
// 1️⃣ URL PARSING (Browser Side)
// ===============================

// Browser URL ko todta hai:
// protocol → http
// domain   → example.com
// port     → ❌ not provided

// Browser ke paas predefined standards hote hain:
// HTTP  → default port 80
// HTTPS → default port 443

// Isliye browser internally is URL ko aise samajhta hai:
// http://example.com  ==  http://example.com:80



// ===============================
// 2️⃣ DNS RESOLUTION (Domain → IP)
// ===============================

// Browser DNS system se poochta hai:
// "example.com ka IP address kya hai?"

// DNS ka kaam sirf ek hi hota hai:
// domain name ko IP address mein convert karna

// DNS response deta hai:
// example.com → 93.184.216.34

// ⚠️ IMPORTANT:
// DNS kabhi port provide nahi karta
// Port ka decision browser karta hai



// ===============================
// 3️⃣ SERVER IDENTIFICATION
// ===============================

// Ab browser ko clear hai:
// kis MACHINE se baat karni hai → 93.184.216.34
// kis PROGRAM se baat karni hai → port 80 (HTTP server)



// ===============================
// 4️⃣ SOCKET CREATION (IP + PORT)
// ===============================

// Browser OS ko bolta hai:
// "Mujhe ek socket banana hai"

// Client side socket:
// (Client_IP : random_ephemeral_port)

// Server side socket:
// (93.184.216.34 : 80)

// Socket = Communication endpoint
// bina socket ke network communication possible hi nahi



// ===============================
// 5️⃣ TCP CONNECTION ESTABLISHMENT
// ===============================

// Browser aur server ke beech TCP handshake hota hai:

// Client → SYN
// Server → SYN + ACK
// Client → ACK

// Ab dono ke beech ek reliable connection ban chuka hai



// ===============================
// 6️⃣ HTTP REQUEST SEND KARNA
// ===============================

// Browser HTTP protocol ke according request bhejta hai:

// GET / HTTP/1.1
// Host: example.com
// User-Agent: Chrome
// Accept: text/html

// Ye request server ke us program ko milti hai
// jo port 80 pe LISTEN kar raha hota hai
// (Apache / Nginx / Node.js)



// ===============================
// 7️⃣ SERVER SIDE PROCESSING
// ===============================

// Server machine par OS request receive karta hai
// OS request ko web server process ko forward karta hai

// Web server decide karta hai:
// - static HTML file deni hai?
// - ya backend logic run karna hai?

// Example:
// index.html file read hoti hai
// response prepare hota hai



// ===============================
// 8️⃣ HTTP RESPONSE GENERATION
// ===============================

// Server response banata hai:

// HTTP/1.1 200 OK
// Content-Type: text/html
// Content-Length: xxxx

// <html>...</html>

// Ye response socket ke through
// client ko wapas bheja jaata hai



// ===============================
// 9️⃣ CLIENT RESPONSE RECEIVE KARTA HAI
// ===============================

// Browser response receive karta hai
// HTML parse karta hai
// DOM tree banata hai
// CSS apply karta hai
// JavaScript execute karta hai



// ===============================
// 🔟 ADDITIONAL RESOURCE REQUESTS
// ===============================

// HTML ke andar references hote hain:
// <link href="style.css">
// <script src="app.js">
// <img src="logo.png">

// Browser in sab ke liye
// separate HTTP requests bhejta hai
// (same IP + same port 80)



// ===============================
// 1️⃣1️⃣ FINAL RENDERING
// ===============================

// Browser complete UI render karta hai
// User ko website dikh jaati hai 🎉


// ===============================
// 🔥 DEEP FINAL SUMMARY
// ===============================

// HTTP website visit ka matlab:
// 1. User domain deta hai
// 2. DNS IP deta hai
// 3. Browser default port 80 choose karta hai
// 4. Socket banta hai (IP + Port)
// 5. TCP connection establish hota hai
// 6. HTTP request bheji jaati hai
// 7. Server process karta hai
// 8. Response wapas aata hai
// 9. Browser UI render karta hai

// 🎯 KEY POINT:
// DNS sirf IP deta hai
// Port browser decide karta hai
// Port 80 HTTP ka default hota hai

// ---------------------------------------------

// ===============================
// 🔹 SOCKET vs WEBSOCKET (COMMENTED + EXAMPLES)
// ===============================



// ===============================
// 1️⃣ SOCKET (Basic concept)
// ===============================

// Socket ek communication endpoint hota hai
// Socket = IP address + Port
// Ye batata hai:
// "kis machine ke kaunse program se baat karni hai"

// Example:
// Server IP   = 203.0.113.10
// Server Port = 80

// Socket ban jaata hai:
// 203.0.113.10:80



// ===============================
// 2️⃣ SOCKET KA USE (HTTP example)
// ===============================

// Scenario:
// User website open karta hai

// Browser socket banata hai:
// (ClientIP : randomPort) → (ServerIP : 80)

// Browser HTTP request bhejta hai:
// GET /index.html HTTP/1.1

// Server response deta hai:
// HTML page bhej diya

// Kaam khatam
// Socket close ❌

// 👉 Har request ke liye
// socket create → use → destroy



// ===============================
// 3️⃣ WEBSOCKET (Advanced concept)
// ===============================

// WebSocket ek protocol hai (ws / wss)
// jo same socket ko OPEN rakhta hai

// Ye HTTP se start hota hai
// phir "upgrade" ho jaata hai WebSocket mein



// ===============================
// 4️⃣ WEBSOCKET HANDSHAKE (Example)
// ===============================

// Client HTTP request bhejta hai:
// GET /chat HTTP/1.1
// Upgrade: websocket
// Connection: Upgrade

//  Server bole:
// 101 Switching Protocols
// Upgrade successful

// Ab HTTP ❌
// Ab WebSocket connection open ✅



// ===============================
// 5️⃣ WEBSOCKET KA USE (Chat App)
// ===============================

// Client aur server dono
// bina request ke bhi data bhej sakte hain

// Example flow:

// Client → "Hello"
// Server → "Hi"
// Client → "Typing..."
// Server → "Seen"
