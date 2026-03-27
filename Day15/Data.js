const mongoose = require("mongoose");
const { Schema } = mongoose;

// required attribute says it is mandatory to send the data asked for if it's true.
// if unique attribute is true it says that any field having same value such as emailid in this case , it won't allow the document to get registered in db

const DataSchema = new Schema({
  Fname: {
    type: String,
    minLength: 2,
    maxLength: 15,
    required: true,
  },
  Lname: {
    type: String,
  },
  age: {
    type: Number,
    min: 18,
    max: 70,
    required: true,
  },
  contact: {
    type: Number,
    min: 10,
  },
  city: {
    type: String,
  },
  Gender: {
    type: String,
    enum: ["male", "female", "others"],
  },
  Emailid: {
    type: String,
    unique: true,
  },
});

// collection creation through mongoose model following created schema "detailSchema"

const User = mongoose.model("user", DataSchema);

module.exports = User;
