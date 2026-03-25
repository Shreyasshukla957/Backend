const mongoose = require("mongoose");
const { Schema } = mongoose;


 const detailSchema = new Schema({
    name:String,
    age:Number,
    contact:Number,
    address:String,
  });

 const Detail = mongoose.model("user",detailSchema);

 module.exports ={ Detail};