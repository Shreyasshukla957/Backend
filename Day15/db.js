const mongoose = require ("mongoose");


async function main(){
    let connect = await mongoose.connect(
    "mongodb+srvInsta",
  );

  
}

module.exports = main;