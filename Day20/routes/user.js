const express = require("express");
// const app = express();
const userRouter =  express.Router();
const bcrypt = require("bcrypt");
const User = require("../Schema");
const { autho } = require("../middleware/validation");




userRouter.delete("/", autho, async (req, res) => {
  try {
    await User.findOneAndDelete(req.result);
    res.send("Deleted Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

userRouter.patch("/", autho, async (req, res) => {
  try {
    let result = Array.isArray(req.body) ? req.body : Array.of(req.body);

    // array par iterate krne k liye
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

userRouter.delete("/:id", async (req, res) => {
  try {
    let Id = await User.findOneAndDelete(req.params.id);
    res.send("Deleted Successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

module.exports = userRouter;