// check out the learning.md file for better explanation.

const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./chat");

app.use(express.json());

const messagehistory = {};

app.listen(process.env.PORT, () => {
  console.log("Listening to the PORT");
});

app.post("/chat", async (req, res) => {
  const { msg } = req.body;
  const { id } = req.body;

  if (!messagehistory[id]) {
    messagehistory[id] = [];
  }

  const history = messagehistory[id];
  history.push({ role: "user", parts: [{ text: msg }] });

  const answer = await main(history);

  history.push({ role: "model", parts: [{ text: answer }] });
  res.send(answer);



  // using streaming response , where we will print data chunk by chunk which will be in realtime , but yeh sirf streaming api par chlega aur abhi jo gemini ka api use kr rha hu woh streaming api nahi h .
  // let fullans = "";
  // const stream = await main(history);
  // for await (const chunk of stream) {
  //   res.write(chunk);
  //   fullans = fullans+chunk;
   

  // }

  // history.push({ role: "model", parts: [{ text: fullans }] });
  // res.end();


});
