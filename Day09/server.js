const express = require("express");
const app = express();
const {Autho} = require("./middleware/auth")
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



app.get("/food", (req, res) => {
  res.status(200).send(foodItems);
});

app.use("/admin",Autho);

app.get("/admin", (req, res) => {
  res.status(200).send(foodItems);
});

app.post("/admin", (req, res) => {
  foodItems.push(req.body);
  res.status(201).send(foodItems);
});

app.patch("/admin", (req, res) => {
  foodItems.forEach((value) => {
    if(value.id === req.body.id){
      value.id = req.body.id;
      value.food = req.body.food;
      value.cuisine = req.body.cuisine;
      value.price = req.body.price;

    }
  });
  res.status(200).send(foodItems);
});

app.delete("/admin/:id", (req, res ) => {
  foodItems.forEach((value , index) => {
    if(value.id === parseInt( req.params.id)){
      foodItems.splice(index,1);
    }
  });
  res.status(200).send(foodItems);
});

