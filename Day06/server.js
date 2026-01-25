const express = require("express");

const app = express();
// ✅ NOTE:
// Agar main browser me "/data" likhu (http://localhost:4000/data)
// phir bhi "/" wala route open ho raha hai — aisa isliye hota hai kyunki
// Express me app.use("/") ek "catch-all / prefix route" hota hai.
//
// ✅ Express ka route matching rule:
// app.use("/...") exact match nahi karta, balki "prefix match" karta hai.
// Matlab:
// "/" route har request ko match kar lega because every path "/" se start hota hai.
//
// Example:
// "/data"  -> starts with "/" ✅
// "/contact" -> starts with "/" ✅
// "/detail" -> starts with "/" ✅
//
// ✅ Execution flow:
// Express routes ko TOP to BOTTOM check karta hai.
// Jo route pehle match ho jaata hai, wohi response send kar deta hai
// aur baaki routes check hi nahi hote.
//
// ⚠️ Iska matlab yeh "nested route" wala concept nahi hai.
// "/data" koi "/" ke andar nested nahi hota,
// balki "/data" khud ek separate root-level route hota hai.
//
// ✅ Fix:
// Isliye "/" ko hamesha last me likhna chahiye,
// taaki pehle "/data", "/contact", etc. match ho jaye,
// aur "/" ko hum fallback/home route ki tarah use kar sake.

// isiliye isko last mein initialize kr rha hu
// app.use("/" , (req, res) => {
//   res.send("Welcome to my website");
// });


// ? agar use kiya route mein "/dat?a" toh yha t likhna optional h matalb url mein "/daa" ya "data" dono chlega
// + agar use kiya route mein "/dat+a" toh yha t repetitive time likdo matlab url mein "/datttttta" ya "data" dono chlega chlega 
// * agar use kiya route mein "/dat?a" toh yha "ta" ke beech mein kuch bhi likdo  matalb url mein "/dat9343403a" ya "data" dono chlega

app.use("/data/:id" , (req, res) => {
    console.log(req.params);//yeh id bta dega kya likha h url mein  
  res.send({ name: "Rohit", age: 20, Mon: "day" });
});

app.use("/contact" , (req, res) => {
  res.send("I am your contact page");
});

app.use("/detail" , (req, res) => {
  res.send("I am your Detail page");
});

app.listen(4000, () => {
  console.log("Listeneing at port 4000");
});

app.use("/" , (req, res) => {
  res.send("Welcome to my website");
});