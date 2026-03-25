const express = require("express");
const app = express();
const main = require("./db")
const User = require("./Data");


main()
.then(()=>{
    console.log("Connected to db");
    app.listen(3000,()=>{
        console.log("Listening at server 3000");
    })
})
.catch((err)=>{
    console.log(err);
})