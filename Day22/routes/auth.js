const express = require("express");
const app = express();
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Schema");
const Vuser = require("../utils/valuser");
const redisClient = require("../config/redis");
const jwt = require("jsonwebtoken");
const { autho } = require("../middleware/validation");

authRouter.post("/register", async (req, res) => {
  try {
    //  Vuser(req.body).then(async ()=>{
    //   await User.create(req.body);
    //  });   //this is also a way here to handle this same as

    await Vuser(req.body);
    await User.create(req.body);

    res.send("Registered Data Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const ans = await User.findOne({ Emailid: req.body.Emailid });

    if (!(ans.Emailid === req.body.Emailid)) {
      throw new Error("Invalid Credentials");
    }

    const pass = ans.crypt(req.body.Password);

    if (!pass) {
      throw new Error("Invalid credentials");
    }

    // jwt token
    // eyJhbGciOiJIUzI1NiJ9  .  eyJpZCI6IjEyMyJ9  .  xK9Lz2mP...
    //   Header                   Payload            Signature
    //                                                   ↑
    //                                       created using "sonu@1234"
    // this is the server key sonu@1234 which is very important and shouldn't be shared as it encrypts/signs the hashcode of
    //  header + payload.
    //"payload" , "key" , "expiresIn"
    const token = ans.getJWT();
    // jwt sign internally hashing krta h header+payload ka aur header bhi add krdeta h token mein

    res.cookie("token", token);
    res.send("Login Successfully");
  } catch (err) {
    res.send("Error is" + err.message);
  }
});

authRouter.post("/logout", autho, async (req, res) => {
  try {
    // token verify krwana padega pehle agar token hi aisa h jo server ne nhi bnaya h toh uske liye hum verification krwayenge token ka.

    const { token } = req.cookies;
    console.log(token);

    //decode krdega payload ko
    const payload = jwt.decode(token);
    console.log(payload);

    // Why we use token as prefix because we want to organize keys properly bohot token aate rhenge toh organized rhe aur fast fetch krsake.
    await redisClient.set(`token:${token}`, "Blocked");
    //  after 30 mins the same token will be expired
    //  this is ttl where we give exactv time of expiry in seconds
    //  await redisClient.expire(`token:${token}`,1800);

    // from payload we will get access of the iat and exp and to get our token expire from unix epoch we will use expireat because it will take input from unix epoch.
    await redisClient.expireAt(`token:${token}`, payload.exp);

    // res.cookie("token", null, { expires: new Date(Date.now()) });

    res.send("Logout Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

module.exports = authRouter;
