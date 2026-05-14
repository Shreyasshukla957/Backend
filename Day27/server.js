const express = require("express");
const app = express();
// const mgdb = require("./config/DConnect");
// const User = require("./Schema");
require("dotenv").config();
// const {redisClient , connectRedis} = require("./config/redis");
const weather = require("./tools/weather");
const main = require("./chat");

app.use(express.json());

const start = async () => {
  try {
    // await Promise.all([connectRedis(),mgdb()]);
    //     console.log("Connected to Redis");
    //     console.log("Connected to Database");

    app.listen(process.env.PORT, () => {
      console.log("Listening at server 3000");
    });
  } catch (err) {
    console.log("Error" + err.message);
  }
};

start();

const conversationhistory = {};

app.post("/user", async (req, res) => {
  try {
    const username = req.body.name;

    if (!conversationhistory[username]) {
     conversationhistory[username] = [];
      
    }

    let history =  conversationhistory[username];

    // const usermsg = [
    //   {
    //     role: "user",
    //     parts: [
    //       {
    //         text: req.body.msg,
    //       },
    //     ],
    //   },
    // ];

    history.push({
      role: "user",
      parts: [
        {
          text: req.body.msg,
        },
      ],
    });

    const response = await main(history);
    const jresponse = JSON.parse(response);
    history.push({ role: "model", parts: [{ text: response }] });
    console.log(typeof jresponse);
    const weatherdata = await weather(jresponse);

    history.push({
      role: "user",
      parts: [
        {
          text: `Weather JSON: ${JSON.stringify(weatherdata)}. 
    Is data se user ke sawaal ka friendly jawab do.`,
        },
      ],
    });

    const finalResponse = await main(
      history,
      "You are a helpful weather assistant. Answer naturally and friendly.",
    );

    history.push({
      role: "model",
      parts: [{ text: finalResponse }],
    });

    res.send(finalResponse);
    res.send(weatherdata);
  } catch (err) {
    res.send("Error" + err.message);
  }
});
