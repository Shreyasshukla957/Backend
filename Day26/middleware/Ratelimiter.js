const { redisClient } = require("../config/redis");
const crypto = require("crypto");

const Ratelimiter = async (req, res, next) => {
  try {
    const key = req.ip;
    const Window = Date.now() - 3600000;
    const uniquevalue = crypto.randomUUID();

    await redisClient.zAdd(key, {
      score: Date.now(),
      value: `${uniquevalue}:${Date.now()} `,
    });

    await redisClient.zRemRangeByScore(key, 0, Window);

    const count = await redisClient.zCard(key);
    console.log(count);
    if (count > 30) {
      throw new Error("Too many request");
    }

    await redisClient.expire(key, 3600);

    next();
  } catch (err) {
    res.send("Error" + err.message);
  }
};

module.exports = Ratelimiter;
