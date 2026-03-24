const mongoose = require("mongoose");
const { Schema } = mongoose;
const Detail = require("./Models/Detail");

async function main() {
  // let connect = await mongoose.connect(
  //   "mongodb+srv/Detailbase",
  // );


  // "connectionstring/databasename" => create ho jaayega naya database jiska naam hoga "Detailbase" same as "Codingme" jo ki ek already existing database h waise hi naya db automatically bn jaayega "Detailbase" naam ka bina create kre bas connectionstring/"dbname" likh kr.

  // Schema creation
  // const detailSchema = new Schema({
  //   name:String,
  //   age:Number,
  //   contact:Number,
  //   address:String,
  // });

  // Model ko create === Collection Create krna (Table create krna)

  // const Detail = mongoose.model("user",detailSchema);

  // document create kiya h
  //   const user1 = new Detail({name:"Shreyas",age:20}); //ek document hi bna sakta h
  //   await user1.save(); //.save() mongodb ke database mein user1 ko save kra rha h

  //  await Detail.create([{name:"Mohan",age:43,contact:234567654},{name:"Soham",age:41,contact:254567654},{name:"Rohan",age:45,contact:234346654}]); //yeh create bhi krta h aur save bhi database mein krdeta h bina .save() likhe aur yeh array k form mein multiple document bna sakta h ek baar mein .

  //   // it can also create multiple documents but it's faster than create as it by passed hooks and skips validation
  //  await Detail.insertMany([{ name: "Alice" }, { name: "Bob" }]);

  // //  finds all the data stored
  //  const ans = await Detail.find({})
  //  console.log(ans);

  // find document by particular field
  //  const result = await Detail.find({name:"Shreyas"})
  //   console.log(result);
}

// main()
//   .then(() => {
//     console.log("Connected to Db");
//   })
//   .catch((err) => console.log(err));

module.exports = main;
