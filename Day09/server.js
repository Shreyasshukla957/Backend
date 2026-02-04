const express = require("express");
const app = express(); 

app.listen(4000, () => {
  console.log("Listening at port no 4000");
});

app.use(express.json());
// CRUD operations
// Database

const foodItems = [
  { id: 1, food: "Paneer Butter Masala", cuisine: "North Indian", price: 220 },
  { id: 2, food: "Chicken Biryani", cuisine: "Hyderabadi", price: 260 },
  { id: 3, food: "Masala Dosa", cuisine: "South Indian", price: 90 },
  { id: 4, food: "Veg Burger", cuisine: "Fast Food", price: 80 },
  { id: 5, food: "French Fries", cuisine: "Fast Food", price: 70 },
  { id: 6, food: "Gulab Jamun", cuisine: "Indian Dessert", price: 50 },
  { id: 7, food: "Ice Cream", cuisine: "Dessert", price: 60 },
  { id: 8, food: "Momos", cuisine: "Tibetan", price: 100 },
  { id: 9, food: "Cold Coffee", cuisine: "Beverage", price: 120 },
  { id: 10, food: "Pav Bhaji", cuisine: "Street Food", price: 140 },
  { id: 11, food: "Rajma Chawal", cuisine: "North Indian", price: 180 },
  { id: 12, food: "Chole Bhature", cuisine: "Punjabi", price: 160 },
  { id: 13, food: "Samosa", cuisine: "Street Food", price: 25 },
  { id: 14, food: "Butter Naan", cuisine: "North Indian", price: 40 },
  { id: 15, food: "Fish Curry", cuisine: "Coastal Indian", price: 280 },
];

// user ka added food items iss AddtoCart wale mein chla jaayega
const AddtoCart = [];

app.get("/food",(req,res)=>{
    res.status(200).send(foodItems);
})


app.use("/admin",(req,res,next)=>{
  const auth = "ABCDEF";
  const ans = auth === "ABCDEF" ? 1 : 0;
  if(!ans){
    res.status(403).send("Authorization failed");
  }

  next();
})

app.get("/admin",(req,res)=>{
  res.status(200).send(foodItems);
})



