const express = require("express");
const app = express();
const main = require("./mgoose");
const Detail = require("./Models/Detail");

app.use(express.json());

app.get("/info",async (req,res)=>{
  
 const ans = await Detail.find({})
 res.send(ans);

})


app.post("/info",async(req,res)=>{


  const ans = new Detail(req.body);
  await ans.save();

  res.send("Data Inserted Successfully");


})

// taking data from front-end(postman) here and than updating in db.
app.put("/info",async(req,res)=>{

  const result = await Detail.updateOne({name:req.body.name},{$set:req.body});


  res.send("Updated Successfully")

})

// taking data from front-end(postman) here and than deleting from db.
app.delete("/info",async(req,res)=>{

  await Detail.deleteOne({"name" :req.body.name}) ;


  res.send("Updated Successfully")

})


// 1st Way of connecting db before server starts
main()
  .then( async () => {
    app.listen(4000, () => {
      console.log("Listening at port no 4000");

    });
    console.log("Connected to Db");
  //  finds all the data stored
   const ans = await Detail.find({})
   console.log(ans);
  })
  .catch((err) => console.log(err));

// 2nd Way of connecting db before server starts
// async function start() {
//   await main();
//   app.listen(4000, () => {
//     console.log("Listening at port no 4000");
//   });
//   console.log("Connected to Db");
// }

// start();


// CRUD operations
// Database
