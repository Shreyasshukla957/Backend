const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const DataSchema = new Schema(
  {
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
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", DataSchema);
module.exports = User;
