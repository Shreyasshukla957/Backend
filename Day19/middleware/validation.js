const User = require("../Schema");
const jwt = require("jsonwebtoken");

const autho = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const payload = jwt.verify(token, "sonu@1234");
    console.log(payload); //payload k andar saara data hoga client ka jaise emailid , name , id aur bhi jo server client ko bheja hoga

    const { id } = payload;

    if (!id) {
      throw new Error("Id invalid");
    }

    req.result = await User.findById(id);

    if (!req.result) {
      throw new Error(" User Doesn't exist");
    }
    next();
  } catch (err) {
    throw new Error("Error" + err.message);
  }
};

module.exports = { autho };
