const express = require("express");
const app = express();
const main = require("./db");
const User = require("./Data");

app.use(express.json());

main()
  .then(() => {
    console.log("Connected to db");
    app.listen(3000, () => {
      console.log("Listening at server 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/register", async (req, res) => {
  try {
    await User.create(req.body);
    res.send("Registered Data Successfully");
  } catch (err) {
    console.log("Error" + err.message);
  }
});

app.get("/info", async (req, res) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (err) {
    console.log("Error" + err.message);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    let Id =await User.findById(req.params.id);
    res.send(Id);
  } catch (err) {
    console.log("Error" + err.message);
  }
});
