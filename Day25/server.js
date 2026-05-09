const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./chat");

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Listening to the PORT");
});

app.post("/chat", async (req, res) => {
  const { msg } = req.body;
 const answer =  await main(msg);

 res.send(answer);
});
