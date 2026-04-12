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

app.use(express.json());
app.use(cookieParser());

async function start() {
  try {
    await main();
    console.log("Connected to Database");
    app.listen(3000, () => {
      console.log("Listening at server 3000");
    });
  } catch (err) {
    console.log("Error" + err.message);
  }
}

start();

app.post("/register", async (req, res) => {
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

app.get("/info", autho, async (req, res) => {
  try {
    console.log(req.cookies);
    res.send(req.result);
  } catch (err) {
    res.send("Error" + err.message);
  }
});

app.delete("/user", autho, async (req, res) => {
  try {
    await User.findOneAndDelete(req.result);
    res.send("Deleted Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

app.patch("/user",autho, async (req, res) => {
  try {
    let result = Array.isArray(req.body) ? req.body : Array.of(req.body);

    for (let items of result) {
      const { id, ...update } = items;
      // { runvalidators :true } update krne se pehle validate krega phir updation hoga
      let Id = await User.findByIdAndUpdate(id, update, {
        runValidators: true,
      });
    }

    res.send("Updated Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const ans = await User.findOne({ Emailid: req.body.Emailid });

    if (!(ans.Emailid === req.body.Emailid)) {
      throw new Error("Invalid Credentials");
    }

    const pass = await bcrypt.compare(req.body.Password, ans.Password);

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
    const token = jwt.sign(
      { id: ans.id, Emailid: req.body.Emailid },
      "sonu@1234",
      { expiresIn: 10 },
    );
    // jwt sign internally hashing krta h header+payload ka aur header bhi add krdeta h token mein

    res.cookie("token", token);
    res.send("Login Successfully");
  } catch (err) {
    res.send("Error is" + err.message);
  }
});
