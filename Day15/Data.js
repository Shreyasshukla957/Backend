const mongoose = require("mongoose");
const { Schema } = mongoose;

const DataSchema = new Schema({
  Fname:{
    type: String
  },
  Lname:{
    type: String
  },
  age: {
    type: Number
  },
  contact:{
    type: Number
  },
  city:{
    type: String
  },
  Gender:{
    type: String
  },
});

// collection creation through mongoose model following created schema "detailSchema"

const User = mongoose.model("user", DataSchema);

module.exports = User;
