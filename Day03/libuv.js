// Working of libuv
// libuv ek C library hai (JavaScript nahi)
// 👉 Jo Node.js ko non-blocking, async aur fast banati hai.
// libuv = OS ke saath async kaam karne ka system


// 🧠 V8 (JS Engine)
// Sirf JavaScript execute karta hai
// Single-threaded
// OS se directly baat nahi kar sakta

// 🖥️Operating System
// File read/write
// Network sockets
// Timers
// DNS
// CPU threads


// 🔗 libuv = Bridge
// V8  ↔️  libuv  ↔️  OS


// V8 se kaam leta hai
// OS ko async task deta hai
// Result wapas JS ko safely deta hai

//  libuv exactly kaun-kaun se kaam karta hai?
// ✅ OS Async Kaam (Direct OS se)
// Network I/O (HTTP, sockets)
// Timers
// Event polling

// ✅ Thread Pool Kaam (libuv threads)
// Default = 4 threads


// 🔹 Node.js ke MAIN PARTS
// V8 Engine
// libuv
// Event Loop
// Thread Pool
// Node Core C++ APIs
// Built-in Modules
// Operating System

// 🔹 Node.js ke KEY FEATURES
// Non-blocking I/O
// Event-driven architecture
// Single-threaded JS
// Multi-threaded background work
// High scalability
// Platform independent
// Fast execution

// setTimeout ka naam aur access window / globalThis ke paas hota hai,
// window.settimeout se hum settimeout ko access krte h
// window / globalThis sirf ek ENTRY POINT hai
// setTimeout ka actual implementation JavaScript mein nahi hota
// Ye browser ke native code (Web API) mein likha hota hai
// lekin setTimeout ko chalane ka kaam Web APIs + Browser Process (browser mein)
// ya libuv (Node.js mein) ke paas hota hai.

// ======================================================
// COMPLETE CHRONOLOGY: Working of Node.js 
// “ye function JS ka nahi, host ka hai — main control de raha hoon”
// ======================================================


// 🟢 STEP 1: JS file start hoti hai
// Node.js JS file load karta hai
// V8 engine execution start karta hai
// Call Stack mein JS code push hota hai


// 🟢 STEP 2: V8 ko `setTimeout` milta hai
// V8 check karta hai:
// ❌ Ye pure JavaScript ka function nahi hai
// ✅ Ye Node.js ka HOST-PROVIDED API hai

// 👉 Yahin V8 internally samajhta hai:
// "Ye mera JS ka kaam nahi hai"


// 🟢 STEP 3: V8 decision nahi leta, sirf HANDOFF karta hai
// V8 async ka logic decide nahi karta
// V8 sirf control Node.js ke native (C++) layer ko deta hai

// JS (V8)
//   ↓
// Node.js Native Bindings (C++)


// 🟢 STEP 4: Node.js native C++ layer active hoti hai
// Node.js bolta hai:
// "Achha, ye timer-related kaam hai"
// "Isko async handle karna padega"

// Node.js yahan libuv ko involve karta hai


// 🟢 STEP 5: libuv ka kaam start hota hai
// libuv ek C library hai
// Ye OS ke saath async kaam karti hai

// libuv kya karta hai?
// - OS timer register karta hai
// - JS thread ko block nahi karta
// - Background mein kaam chala deta hai

// libuv  →  OS Timer / Clock


// 🟢 STEP 6: OS side pe timer complete hota hai
// OS bolta hai:
// "Timer complete ho gaya"

// OS → libuv ko signal deta hai


// 🟢 STEP 7: libuv callback ko Event Loop ko deta hai
// Callback abhi execute nahi hota
// Ye Event Loop ke Timer Phase / Queue mein chala jata hai


// 🟢 STEP 8: Event Loop check karta hai
// Call Stack empty hai? ✅
// Agar haan → callback Call Stack mein push hota hai


// 🟢 STEP 9: V8 callback execute karta hai
// Ab dubara V8 ka role aata hai
// V8 callback ke andar ka JS code execute karta hai

// console.log("done");


// ======================================================
// FINAL SUMMARY (ONE LINE)
// ======================================================

// V8 async decide nahi karta
// V8 sirf host API dekh kar control handoff karta hai
// Async kaam Node.js + libuv + OS handle karte hain
// Callback wapas aakar V8 hi execute karta hai


// ======================================================
// BROWSER ASYNC CHRONOLOGY (WORKING OF BROWSER)
// ======================================================


// 🟢 STEP 1: JS code execution start
// Browser JS file load karta hai
// V8 engine JS execute karta hai
// Call Stack mein synchronous code chalta hai


// 🟢 STEP 2: V8 ko async API milti hai (e.g. setTimeout / fetch)
// V8 check karta hai:
// ❌ Ye pure JavaScript ka function nahi
// ✅ Ye Browser ka HOST-PROVIDED API hai (Web API)

// V8 internally samajhta hai:
// "Ye browser ka kaam hai, mera nahi"


// 🟢 STEP 3: V8 sirf CONTROL HANDOFF karta hai
// V8 async logic decide nahi karta
// V8 Browser ke native (C++) Web API layer ko control deta hai

// JS (V8)
//   ↓
// Browser Native Web APIs (C++)


// 🟢 STEP 4: Web APIs ka role
// Browser bolta hai:
// "Ye async kaam hai (timer / network / events)"
// "Isko background mein handle karna hai"

// Web APIs Browser Process ko involve karti hain


// 🟢 STEP 5: Browser Process + OS
// Browser ka native code OS ke resources use karta hai

// Examples:
// - Timer → OS clock
// - fetch → OS networking stack
// - events → browser event system

// Browser → OS


// 🟢 STEP 6: OS async kaam complete karta hai
// OS browser ko signal deta hai
// "Kaam complete ho gaya"


// 🟢 STEP 7: Browser callback ko Task Queue mein daalta hai
// Callback abhi execute nahi hota
// Ye Task Queue / Microtask Queue mein jata hai


// 🟢 STEP 8: Event Loop ka role
// Call Stack empty? ✅
// Pehle microtasks
// Phir task queue
// Callback Call Stack mein push hota hai


// 🟢 STEP 9: V8 callback execute karta hai
// Callback ke andar ka JS code V8 hi execute karta hai

// ======================================================
// BROWSER FINAL SUMMARY
// ======================================================

// V8 → sirf JS execute + handoff
// Browser → async ka decision
// Web APIs + OS → async handling
// Callback execute → phir V8

// -------------------------------------------------------------------

// Why & How Node.js is Platform Independent (Clear Explanation)

// Node.js platform independent isliye hai kyunki Node ke andar libuv naam ka ek layer hota hai jisme aisa code likha hota hai jo har tarah ke Operating System se baat kar sakta hai.

// libuv ke andar:

// Windows ke liye alag OS-level code hota hai
// Linux ke liye alag OS-level code hota hai
// macOS ke liye alag OS-level code hota hai
// Par upar se Node.js aur JavaScript ke liye interface same rehta hai.

// Iska matlab:

// JavaScript ko kabhi directly OS se baat nahi karni padti
// JavaScript sirf Node APIs use karta hai (fs, timers, network)
// libuv internally decide karta hai ki kaun-sa OS hai aur uske hisaab se kaun-sa system call use karna hai

// Isliye:

// Node.js ka binary OS-specific hota hai
// Lekin JavaScript code same rehta hai
// Aur wahi code Windows, Linux aur macOS par bina change ke chal jaata hai


// -------------------------------------------------------------------

// libuv working ka Small Example
// fs.readFile("a.txt", cb);

// 🔁 Internal Flow of this Example 

// 1️⃣ JS code execute hota hai (V8)
// 2️⃣ V8 host API pe aata hai → Node.js C++ layer ko handoff
// 3️⃣ Node.js C++ layer libuv ko call karta hai
// 4️⃣ libuv task thread pool ko deta hai
// 5️⃣ Thread pool background mein kaam complete karta hai
// 6️⃣ libuv completion par Event Loop ko notify karta hai
// 7️⃣ Callback Macrotask / Callback Queue (poll phase) mein queue hota hai
// 8️⃣ Call Stack empty hota hai
// 9️⃣ Event Loop pehle Microtask Queue clear karta hai
// 🔟 Event Loop macrotask uthata hai
// 1️⃣1️⃣ V8 callback execute karta hai

// 👉 JS kabhi block nahi hota

// 2 types of Queues:
// 
// 1️⃣ Macrotask Queue / Callback Queue :- setTimeout/setInterval/fetch
// High Priority Microtasks Queue
// 2️⃣ Microtask Queue:- promises.then/catch/finally

// -------------------------------------------------------------------
// Example
// const fs = require("fs");

// console.log("Start");

// setTimeout(() => {
//   console.log("Timer finished");
// }, 2000);

// fs.readFile("data.txt", "utf-8", (err, data) => {
//   console.log("File read completed");
// });

// setImmediate(() => {
//   console.log("Immediate executed");
// });

// console.log("End");
// ---------------------------------------------------------------------
// 🧠 NOW SAME CODE — STEP-BY-STEP INTERNAL WORKING 

// const fs = require("fs");
// // ↑ JS runs this line on CALL STACK
// // fs module internally uses libuv for async file operations

// console.log("Start");
// // ↑ Runs immediately on JS thread
// // ↑ Output: Start

// setTimeout(() => {
//   console.log("Timer finished");
// }, 2000);
// /*
// 1️⃣ JS sees setTimeout
// 2️⃣ JS hands timer to libuv
// 3️⃣ libuv registers timer with OS
// 4️⃣ Callback is stored
// 5️⃣ JS DOES NOT wait
// */

// fs.readFile("data.txt", "utf-8", (err, data) => {
// /*
// 8️⃣ When file reading finishes:
//    → Thread pool notifies libuv
//    → libuv pushes this callback to I/O queue
// */
//   console.log("File read completed");
//   // 9️⃣ Event Loop sends this callback to CALL STACK
//   // 10️⃣ JS executes it
// });

// setImmediate(() => {
//   console.log("Immediate executed");
// });
// /*
// 6️⃣ setImmediate callback registered
// 7️⃣ Will execute in CHECK PHASE of event loop
// */

// console.log("End");
// // ↑ Runs immediately
// // ↑ Output: End

// ONE-LINE INTERNAL SUMMARY 
// JS gives work → libuv manages it → OS / Thread pool executes → Event Loop brings callback back → JS executes safely


// --------------------------------------------------------------------

// Browser vs Node.js

// NODE.JS                          BROWSER
// ------------------------------------------------
// V8 (JS engine)     ||         V8 / JS engine
// libuv              ||          Browser Runtime
// Thread Pool        ||          Browser Worker Threads
// OS                 ||           OS

// 👉 Browser Runtime = libuv ka equivalent


// 1️⃣ Browser mein kaun OS se baat karta hai?

// ❌ JavaScript Engine (V8)
// Single-threaded
// Sirf JS execute karta hai
// OS se direct baat nahi karta

// ✅ Browser Runtime (Actual Hero)
// Browser ke paas hota hai:
// Web APIs
// Networking layer
// Timer system
// Thread pool / workers
// Rendering engine
// 👉 Ye sab milkar OS se baat karte hain


// 2️⃣ Browser Web APIs kya hote hain?

// Web APIs = Browser ke native C++ features
// (JS ka part nahi hote)

// Examples:

// setTimeout
// fetch
// DOM events
// geolocation
// localStorage

// 👉 Ye internally:

// OS threads use karte hain
// Network stack use karte hain
// JS ko block hone se bachate hain

// 3️⃣ Example: fetch() browser mein kaise kaam karta hai?
// fetch("https://api.com")
//   .then(res => res.json())
//   .then(data => console.log(data));

// 🔁 Internal Flow (Browser)

// 1️⃣ JS engine fetch() dekhta hai
// 2️⃣ Request Browser Web API ko de deta hai
// 3️⃣ Browser Web API → OS networking stack
// 4️⃣ OS se response aata hai
// 5️⃣ Callback → Microtask Queue
// 6️⃣ Event Loop → JS Call Stack
// 7️⃣ console.log(data) execute hota hai

// 👉 JS kabhi block nahi hota

// Node vs Libuv
// Node.js
// JavaScript runtime / platform
// JS ko browser ke bahar chalata hai
// APIs deta hai: fs, http, timers, crypto
// Glue / manager ka kaam karta hai:
// JS Engine (V8) ↔ Async system (libuv)
// C++ mein likha hua runtime
// Uses:
// V8
// libuv
        // VS
// Libuv
// Low-level async I/O engine (C library)
// Async ka actual engine
// Kaam:
// Event Loop
// OS async I/O
// Thread Pool (default 4)
// JS ko direct nahi janta