const User = require("../Schema");
const jwt = require("jsonwebtoken");
const {redisClient} = require("../config/redis");

const autho = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    console.log(payload); //payload k andar saara data hoga client ka jaise emailid , name , id aur bhi jo server client ko bheja hoga

    const { id } = payload;

    if (!id) {
      throw new Error("Id invalid");
    }

    req.result = await User.findById(id);

    if (!req.result) {
      throw new Error(" User Doesn't exist");
    }

    // yha par hum check krenge token jo aaya h kya woh blocked toh nahi h kyunki har jagah autho he check kr rha h as an middleware before fullfilling any request made by the client
    // redisClient.exists return in true or false.
    const blocked = await redisClient.exists(`token:${token}`);

    if(blocked) {
      throw new Error("Invalid Token");
    }

    next();
  } catch (err) {
    throw new Error("Error" + err.message);
  }
};

module.exports = { autho };
