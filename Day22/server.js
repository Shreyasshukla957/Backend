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
const authRouter = require("../Day22/routes/auth");
const userRouter = require("../Day22/routes/user")
const {redisClient , connectRedis} = require("./config/redis")

// console.log(process.env);

app.use(express.json());
app.use(cookieParser());

const start = async ()=> {
  try {
    // await main();
    // console.log("Connected to Database");

    // await connectRedis();
    // console.log("Connected to Redis");

    // parallely runs both the promise and if single fails error is thrown.
    await Promise.all([connectRedis(),main()]);
        console.log("Connected to Redis");
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



