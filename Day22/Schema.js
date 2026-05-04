const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// yha par function () yeh wala hi use hoga because "this" ka matlab har jagah alag hota h agar galti se arrow use krenge toh waha par this kisi aur ko point krega yha par this uss obj ko point kr rha h jisne usko call kiya h "ans"
DataSchema.methods.getJWT = function () {
  return jwt.sign({ id: this.id, Emailid: this.Emailid }, process.env.SECRET_KEY , {
    expiresIn: 10,
  });
};

DataSchema.methods.crypt = async function (Password1) {
  const ans = await bcrypt.compare(Password1, this.Password);
  return ans;
};


const User = mongoose.model("user", DataSchema);
module.exports = User;
// method bhi issi k saath import ho gya because user ram mein ussi address ko point kr rha h jismein 
