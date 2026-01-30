const express = require("express");

const app = express();

// app.use("/open",((req,res)=>{
//     // res.send("Hello World");
//     // 2 res cannot be sent in a single request
//     res.send({name:"Ram",age:22});
// }))

app.listen(4000, () => {
  console.log("Listening on port 4000");
});

// "get" method se request karna hai toh server response dega
// app.get("/",((req,res)=>{
//     // res.send("Hello World");
//     // 2 res cannot be sent in a single request
//     res.send({name:"Ram",age:22});
//     console.log(req);// req bohot bada object hai iske andar bohot saara data hota h jo bheja jaata h server ko front end se
// }))

// app.post("/post",((req,res)=>{
//     // res.send("Hello World");
//     // 2 res cannot be sent in a single request
//     // res.send({name:"Ram",age:22});
//     res.send("Data stored successfully");

// }))

// fetch("http://localhost:4000/"
// frontend se kaise post method se request karenge
// method mention krna padta h tabhi woh samjhta h kaunsa operation perform krna h ki data bhejna h warna automtically get method hi smjhega aur data maangega backend se

// const response = await fetch("http://localhost:4000/post",{
//     method:"POST",
//     headers:{
//         "Content-Type":"application/json"
//     },
//     body:JSON.stringify({
//         name:"Ram",
//         age:22
//     })
// });

// get method mein bhi iss format mein likh sakte h , par uska koi use nahi kyunki get method mein data bhejne / update / delete ki zarurat nahi hoti h toh hum seedha fetch opertaion use krte h kyunki yeh by default browser inject krdeta h saara poperty

// ex:- fetch("http://localhost:4000/post")

// isi ko kehte h api endpoint , kyunki front-end mein inhi se data maangte h
// app.post("/post",((req,res)=>{
//     // res.send("Hello World");
//     // two res cannot be sent in a single request
//     res.send("Data stored successfully");

// }))

// abhi humari problem yeh h ki server ko hum data par kaunsa operation perform krna h post/put/patch/delete bta nahi sakte , kyunki uske liye humein front-end bnana padega aur phir waha se post/put/patch/delete method bhejna padega tabhi server samjh paayega ki humein kya karna h data ke saath
// toh pata kaise chlega ki server data par operation perform kr rha h ki nahi , abhi tak toh sirf get method wala operation perform kr rha tha ,  automatically usmein humein front-end ki jarurat itni thi nahi kyunki url se get method jaa rha tha
// isi cheez ko test krne k liye humare pass "POSTMAN" h jo testing mein help krta h

//Dono ka path /user hi hain , toh pata kaise chalega ki konsa method use karna h
// jaise front-end se req aaya ki operation perform krna (post ya get) aur dono bhi same path par jaa rha h toh kaun handle krega , iske liye Method bheja jaata h ex:- Method: GET/POST/PUT/DELETE/PATCH aur yeh method , req ke andar store hokar aata h front-end se aur uske hisaab se server operation perform krta h ki kya karna h data ke saath is path par toh req mein read krleta h ki post aaya h toh /user wala post perform krta h
// app.get("/user",((req,res)=>{
//     // res.send("Hello World");
//     // 2 res cannot be sent in a single request
//     res.send({name:"Ram",age:22});
//     console.log(req);// req bohot bada object hai iske andar bohot saara data hota h jo bheja jaata h server ko front end se
// }))

// app.post("/user",((req,res)=>{
//     // res.send("Hello World");
//     // 2 res cannot be sent in a single request
//     // res.send({name:"Ram",age:22});
//     res.send("Data stored successfully");

// }))

// parsing kr rhe h
app.use(express.json());

// "get" method se request karna hai toh server response dega
// app.get("/", (req, res) => {
//   // res.send("Hello World");
//   // 2 res cannot be sent in a single request
//   res.send({ name: "Ram", age: 22 });
//   console.log(req); // req bohot bada object hai iske andar bohot saara data hota h jo bheja jaata h server ko front end se
// });

// app.post("/post", (req, res) => {
//   // res.send("Hello World");
//   // 2 res cannot be sent in a single request
//   // res.send({name:"Ram",age:22});
//   res.send("Data stored successfully");
//   console.log(req.body); // req.body mein front-end se bheja hua data aayega , yha par undefined aarha h , iske liye humein parsing krni padti h
// });

// iska mtlab kya hain woh dekhte h

// const response = await fetch("http://localhost:4000/post",{
//     method:"POST",
//     headers:{
//         "Content-Type":"application/json"
//     },
//     body:JSON.stringify({
//         name:"Ram",
//         age:22
//     })
          // Front-end se hum data JSON format me bhejte hain.
          // Hum directly object format me data nahi bhej sakte, kyunki network call ke through
          // data transfer hota hai aur network objects ko samajh nahi pata.
          // Network sirf text/string (and ultimately binary) ko transfer karta hai.
          // Isiliye data ko transfer karne ke liye hume object ko string format me convert karna padta hai.
          // Front-end par hum JSON.stringify() ka use karke JavaScript object ko JSON string me convert karte hain,
          // phir us string ko backend ko send kar dete hain.
          // ✅ Extra reason:
          // JSON ek universal standard format hai, jise Python, Java, C#, Go, etc. jaise
          // multiple languages easily samajh sakti hain.
          // Isliye APIs me mostly JSON use hota hai.
// });

// Front-end se data JSON format mein aata h
// app.use(express.json());
// yeh humein JSON format data ko parse krke JS Object mein convert krke deta h taaki hum usse read kr sakein req.body ke through aur uske andar jo data h usse access kr sakein req.body ke through.
// agar yeh na ho toh req.body undefined aayega kyunki server ko pata hi nahi chalega ki data kaunsa format mein aaya h.

app.post("/post", (req, res) => {
  // res.send("Hello World");
  // 2 res cannot be sent in a single request
  // res.send({name:"Ram",age:22});
  res.send("Data stored successfully");
  console.log(req.body); // req.body mein front-end se bheja hua data aayega , yha par undefined aarha h , iske liye humein parsing krni padti h
});

// Yahan req.body already parse ho chuka hai.
// express.json() middleware JSON string ko JavaScript object me convert karta hai,
// taaki hum req.body ko easily read aur apne logic me use kar sakein.
// Lekin dhyaan rahe:
// JSON parse hone ke baad bhi agar front-end se age "20" (string) ke form me aayi hai,
// toh req.body.age abhi bhi string hi rahegi, number nahi banegi.
// Isliye agar hume age ko mathematical operations / validations me use karna hai,
// toh usko number me convert karna zaroori hai.
// Example:
 // req.body.age = parseInt(req.body.age, 10);  // "20" -> 20
 