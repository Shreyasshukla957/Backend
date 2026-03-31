const bcrypt = require("bcrypt");

const password = "Raju@123";

async function pass() {
  const salt = await bcrypt.genSalt(10);
  const hashpass = await bcrypt.hash(password, salt);
  console.log(salt);
  console.log(hashpass);

  const ans = await bcrypt.compare(password,hashpass);
  // bcrypt.compare internally diye hue "password + salt" ko attach krke algorithm run kr rha hoga utni baar jitni baar uss salt ke aage number diya hoga ($10) aur agar uska hashcode same aagya existing hashcode se toh entry dedega 
  console.log(ans);
}

pass();

// $2b$10$JeFauZgLxjw0NwOKEwq/C.
// $2b$10$JeFauZgLxjw0NwOKEwq/C.ZHt9Wlp57HRO2K0hqxn46PJxTs/xIke
// $2b --> version , $10 --> rounds ,$JeFauZgLxjw0NwOKEwq/C -->Salt (22)
// ZHt9Wlp57HRO2K0hqxn46PJxTs/xIke ---> Hashcode (31)
