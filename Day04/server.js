const http = require("http"); // aisa likhte ho,
// ussi file mein tum http module ke functions use kar sakte ho
// jaise server create karna//export krake http server le aata h
// require() Node.js ka built-in function hai, Ye module ko LOAD karta hai , "http" ek BUILT-IN MODULE hai

// - Ye Node.js ke saath already aata hai
// - Isko install karne ki zarurat nahi hoti

// Jab hum server banate hain, hum define karte hain ki
// “iss particular port par aane wali requests ko
// mera server handle karega aur response bhejega.”

const server = http.createServer((req, res) => {
  // servr bna ne ke baad ek callback function milta h jismein client se req aur server ka res bheja jaa sakta h , yha server ka res bheja jaa rha h res.end("") ke andar
  // res.end("Hello Coder Bhai");

  if (req.url === "/") {
    res.end("Hello Coder Bhai");
  } else if (req.url === "/contact") {
    res.end("contact us");
  } else if (req.url === "/about") {
    res.end("about us");
  }
  else{
    res.end("Error : Page not found")
  }
});

// 👉 Haan ✅ — server multiple ports par listen kar sakta hai.
// isska matlab h iss port par server listen kr rha h , Server  ne OS ko bola hai
// app.listen(3000);
// app.listen(4000);
// app.listen(5000);

// 👉 “Is port par aane wali requests mujhe bhejna”
// OS us port ko is process se bind kar deta hai
server.listen(4000, () => {
  console.log("I am listening at port number 4000");
});

// Working of this
// ✅ module.exports ka kaam:
// ek file se dusri file ko data / function / object dena

// Node.js mein har file ek module hoti hai
// aur har module ke paas ek object hota hai: module.exports

// ===============================
// 🔹 http module ke case mein kya ho raha hai?
// ===============================

// Node.js ke andar ek core file hoti hai: http module
// us file ke andar Node.js ne likha hota hai:

// module.exports = {
//   createServer,
//   request,
//   get,
//   ...
// }

// Matlab:
// http module apne saare useful functions
// ek OBJECT ke form mein export karta hai

// ===============================
// 🔹 require("http") kya karta hai?
// ===============================

// const http = require("http");

// require("http"):
// → http module ki file ko load karta hai
// → uska module.exports utha leta hai
// → aur `http` variable mein store kar deta hai

// ===============================
// 🔹 http variable ke paas kya aata hai?
// ===============================

// http ab ek OBJECT hai
// jisme http module ke saare exported functions hain

// Example:
// http.createServer
// http.request
// http.get

// ===============================
// 🔹 Isliye hum yeh kar paate hain
// ===============================

// const server = http.createServer((req, res) => {
//   res.end("Hello");
// });

// Kyunki:
// http module ne createServer ko export kiya tha
// aur humne us module ko require() kar liya

// ===============================
// 🔥 FINAL UNDERSTANDING
// ===============================

// ✔ module.exports → data / functions BAHAR bhejne ka tareeka
// ✔ http module → apne functions OBJECT ke form mein export karta hai
// ✔ require("http") → us object ko current file mein le aata hai
// ✔ uske baad → hum us object ke andar ke functions use kar sakte hain

// working
// ===============================
// SERVER LISTEN + RESPONSE FLOW
// ===============================

// ===============================
// 1️⃣ Server creation
// ===============================

// const server = http.createServer((req, res) => {
//   // Ye callback tab chalta hai
//   // jab koi client server tak pahunch jaata hai

//   // req  → client ki request hoti hai
//   //        (URL, method, headers, etc.)
//   // res  → server ka response object hota hai
//   //        (isi se data client ko bhejte hain)

//   // Yahan server client ko response bhej raha hai
//   res.end("Hello Coder Bhai");

//   // res.end() ka matlab:
//   // - response body bhej di
//   // - response complete ho gaya
// });

// ===============================
// 2️⃣ Server listening on port 4000
// ===============================

// server.listen(4000, () => {
//   console.log("I am listening at port number 4000");
// });

// Iska matlab:
// Server ab machine ke PORT 4000 pe
// continuously listen kar raha hai

// ===============================
// 3️⃣ Client ka server tak pahunchna
// ===============================

// Jab client browser mein likhta hai:
// http://localhost:4000

// Browser internally karta hai:
// - IP resolve karta hai (localhost → 127.0.0.1)
// - Port 4000 pe request bhejta hai

// ===============================
// 4️⃣ Request server tak kaise jaati hai?
// ===============================

// Client → (IP : random port)
// Server → (127.0.0.1 : 4000)

// Jaise hi request port 4000 par aati hai:
// http.createServer ka callback RUN ho jaata hai

// ===============================
// 5️⃣ Server response kya deta hai?
// ===============================

// Callback ke andar:
// res.end("Hello Coder Bhai");

// Matlab:
// Server bol raha hai:
// "Client bhai, ye lo mera response"

// Browser ko milta hai:
// Hello Coder Bhai

// ===============================
// 🔥 IMPORTANT POINTS
// ===============================

// ✔ server.listen(4000)
//   → server ko bolta hai port 4000 pe suno

// ✔ http.createServer(callback)
//   → har incoming request pe callback run karega

// ✔ res.end()
//   → response bhejta hai + connection close karta hai

// ✔ Jo bhi string res.end() mein doge
//   → wahi client ko dikhai dega

// ===============================
// 🏁 FINAL SUMMARY
// ===============================

// Server port 4000 pe listen kar raha hai
// Client jaise hi is port pe request bhejta hai
// createServer ka callback execute hota hai
// aur server "Hello Coder Bhai" response bhej deta hai
