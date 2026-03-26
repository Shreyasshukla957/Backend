const mongoose = require ("mongoose");


async function main(){
    let connect = await mongoose.connect(
    "mongodb/Insta",
  );

  
}

module.exports = main;