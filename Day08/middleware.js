const express = require("express");
const app = express();
app.use(express.json());

app.listen(3000, (req, res) => {
  console.log("Listening at port no 3000");
});

// chronology of printing
// this functions can be written as [func1,func2,func3] as well or [func1,func2],func3
// app.use(
//   "/user",
//   [
//     (req, res, next) => {
//       console.log("First");

//       next();
//       console.log("Second");
//     },
//     (req, res, next) => {
//       console.log("Third");
//       res.send("Hello Ji");
//       // res.send("Hello Ji");
//       next();
//       console.log("Fourth");
//     },
//     (req, res, next) => {
//       console.log("Fifth");
//       // res.send("Hello Ji");
//       next();
//       console.log("Sixth");
//     },
//   ],
//   (req, res) => {
//     console.log("Seventh");
//     // res.send("Hello Ji");
//     console.log("Eight");
//   },
// );

// Route handler = middleware attached to a specific route like /user
// (req, res, next) => {
//     console.log("First");

//     next();
//     console.log("Second");
//   }

// Can be written Individually aswell works same
// Jisme next parameter hota hai , aur jo next() call karke request ko aage pass karta hai — wo middleware hota hai.

// yeh ek middleware h
app.use("/user", (req, res, next) => {
  console.log("First");
  next();
  console.log("Second");
});

// yeh ek middleware h
app.use("/user", (req, res, next) => {
  console.log("Third");
  // res.send("Hello Ji");
  next();
  console.log("Fourth");
});

// yeh ek middleware h
app.use("/user", (req, res, next) => {
  console.log("Fifth");
  next();
  console.log("Sixth");
});

// yeh middleware nahi h kyunki yeh req kisi ko aage pass nahi kr rha h , yeh response bhej rha h last wala isiliye yeh "Route Handler h"
app.use("/user", (req, res) => {
  console.log("Seventh");
  console.log("Eight");
  res.send("Hello Ji");
});

// ---------------------------------------------------------------------
// It is important to maintain logs of http requests , so that if in future server disrupts or crashes , log would help in debugging / indentifying the cause as it would contains Date , time , Method , URL and much more

// app.get("/log", (req, res) => {
    //  har http req method mein mmultiple lines of code likhna padega 'log' maintain krane k liye jisse time aur readability dono kharab ho jaayegi , isiliye middleware ka use krna best hoga.
    // console.log(`${req.url} , ${req.method} , ${Date.now()} `);
// });  

// app.post("/log", (req, res) => {
// console.log(`${req.url} , ${req.method} , ${Date.now()} `);
// });

// app.patch("/log", (req, res) => {
// console.log(`${req.url} , ${req.method} , ${Date.now()} `);
// });

// app.put("/log", (req, res) => {
// console.log(`${req.url} , ${req.method} , ${Date.now()} `);
// });

// app.delete("/log", (req, res) => {
// console.log(`${req.url} , ${req.method} , ${Date.now()} `);
// });

// iss problem se bachne k liye middleware ka use krenge jaha bas ek baar code likhenge aur woh handle har http req k liye krlega

app.use("/log", (req, res, next) => {
  // log yha maintain krenge iss middleware mein , yeh har "http request" k liye log maintain krega aur next ke through front-end se aaye hue http request ke pass chala jaayega.
  console.log(`${req.url} , ${req.method} , ${Date.now()} `);
  next();
});

app.get("/log", (req, res) => {
  res.send("Log saved");
});

app.post("/log", (req, res) => {
  res.send("Log Added");
});

app.patch("/log", (req, res) => {
  res.send("Log Updated");
});

app.put("/log", (req, res) => {
  res.send("Log fully Updated");
});

app.delete("/log", (req, res) => {
  res.send("Log deleted");
});
