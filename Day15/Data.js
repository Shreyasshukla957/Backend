const mongoose = require("mongoose");
const { Schema } = mongoose;

// required attribute says it is mandatory to send the data asked for if it's true.
// if unique attribute is true it says that any field having same value such as emailid in this case , it won't allow the document to get registered in db
// trim eliminates the unnecessary space
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
    // enum: ["male", "female", "others"],
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Invalid Gender");
      }
    },
  },
  Emailid: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    immutable: true,
  },
},{timestamps:true});

// collection creation through mongoose model following created schema "detailSchema"

const User = mongoose.model("user", DataSchema);

module.exports = User;
