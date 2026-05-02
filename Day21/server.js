const express = require("express");
const app = express();
const main = require("./DConnect");
const User = require("./Schema");
const validate = require("validator");
const Vuser = require("./utils/valuser");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { autho } = require("./middleware/validation");
require('dotenv').config()
const authRouter = require("../Day21/routes/auth");
const userRouter = require("../Day21/routes/user")


// console.log(process.env);

app.use(express.json());
app.use(cookieParser());

async function start() {
  try {
    await main();
    console.log("Connected to Database");
    app.listen(process.env.PORT , () => {
      console.log("Listening at server 3000");
    });
  } catch (err) {
    console.log("Error" + err.message);
  }
}

start();

app.use("/auth",authRouter);
app.use("/user",userRouter);


app.use


app.get("/info", autho, async (req, res) => {
  try {
    console.log(req.cookies);
    res.send(req.result);
  } catch (err) {
    res.send("Error" + err.message);
  }
});



