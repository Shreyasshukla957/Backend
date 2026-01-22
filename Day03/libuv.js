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

// 1️⃣ JS → V8
// 2️⃣ V8 → libuv
// 3️⃣ libuv → Thread Pool
// 4️⃣ Thread reads file
// 5️⃣ libuv notified
// 6️⃣ Event Loop → callback queue
// 7️⃣ JS executes callback

// 👉 JS kabhi block nahi hota


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