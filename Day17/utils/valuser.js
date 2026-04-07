const validate = require("validator");
const bcrypt = require("bcrypt");

async function Vuser(data) {
  const mandatoryFile = ["Fname", "age", "Emailid", "Password"];
  const check = mandatoryFile.every((keys) => Object.keys(data).includes(keys));

  data.Password = await bcrypt.hash(data.Password, 10);
  
  if(!validate.isEmail(data.Emailid)){
    throw new Error("Invalid Credentials")
  }

  if(!validate.isStrongPassword(data.Password)){
    throw new Error("Week Password")
  }

  if(data.Fname.length < 3 && data.Fname.length <= 20){
    throw new Error("Incorrect size of Password");
  }

  if (!check) {
    throw new Error("Fields Missing");
  }
}

module.exports = Vuser;
