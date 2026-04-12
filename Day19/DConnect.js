const mongoose = require("mongoose");

async function main() {
  let connect = await mongoose.connect(
    "mongodb+srv:/Insta",
  );
}

module.exports = main;
