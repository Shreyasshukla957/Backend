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

// we can update it by giving id in params but it is not good practise as always prefer to use request body for update and post while params for delete / get .
app.patch("/user", async (req, res) => {
  try {

    const {id , ...update} = req.body;

    let Id = await User.findByIdAndUpdate(id,update);
    res.send("Updated Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

// better method
