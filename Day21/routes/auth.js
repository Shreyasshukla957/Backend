const express = require("express");
const app = express();
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Schema");
const Vuser = require("../utils/valuser");

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

authRouter.post("/logout", (req, res) => {
  try {
    //  res.cookie("token", "r3m3ru49jfnemjfm"); //wrong token bejdene ka toh reject krdega agli req par
    res.cookie("token", null, { expires: new Date(Date.now()) }); //token expire krwa dene ka toh reject krdega agli req par

    res.send("Logout Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

module.exports = authRouter;
