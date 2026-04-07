const express = require("express");
const app = express();
const main = require("./DConnect");
const User = require("./Schema");
const validate = require("validator");
const Vuser = require("./utils/valuser");
const bcrypt = require("bcrypt");

app.use(express.json());

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

app.get("/info", async (req, res) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (err) {
    res.send("Error" + err.message);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    let Id = await User.findById(req.params.id);
    res.send(Id);
  } catch (err) {
    res.send("Error" + err.message);
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    let Id = await User.findOneAndDelete(req.params.id);
    res.send("Deleted Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

app.patch("/user", async (req, res) => {
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

    const ans = await User.findById(req.body.id);

    if(!(ans.Emailid === req.body.Emailid)){
      throw new Error ("Invalid Credentials");
    }

   const pass = await bcrypt.compare(req.body.Password,ans.Password);

   if(!pass){
    throw new Error ("Invalid credentials")
   }

   res.send("Login Successfully");

  }
   catch (err) {
    res.send("Error is" + err.message);
  }
});
