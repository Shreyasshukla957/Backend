const express = require("express");
const apple = express();

apple.use(express.json());

const bookstore = [
  { id: 1, author: "Rabindranath Tagore", bookname: "Gitanjali" },
  { id: 2, author: "R. K. Narayan", bookname: "Malgudi Days" },
  { id: 3, author: "Munshi Premchand", bookname: "Godaan" },
  { id: 4, author: "Harper Lee", bookname: "To Kill a Mockingbird" },
  { id: 5, author: "George Orwell", bookname: "1984" },
  {
    id: 6,
    author: "J. K. Rowling",
    bookname: "Harry Potter and the Sorcerer's Stone",
  },
  { id: 7, author: "J. R. R. Tolkien", bookname: "The Hobbit" },
  { id: 8, author: "Dan Brown", bookname: "The Da Vinci Code" },
  { id: 9, author: "Paulo Coelho", bookname: "The Alchemist" },
  { id: 10, author: "Chetan Bhagat", bookname: "2 States" },
];

apple.listen(5000, () => {
  console.log("Bookstore server is running on port 5000");
});

apple.get("/books", (req, res) => {
  // bookstore ek JS array/object hai.
  // Express res.send() automatically isko JSON me convert (serialize) karke response bhej deta hai,
  // kyunki network par data text/binary form me transfer hota hai.
  // Isliye objects/arrays ko direct nahi bhej sakte, unhe JSON string me convert karke send kiya jata hai.
  res.send(bookstore);
});

apple.get("/books/:id", (req, res) => {
  const book = parseInt(req.params.id); //req.params.id  data ko hamesha string format me deta h isliye usse integer me convert krna padta h , url mein id dynamic number h aur string nahi smjhega isiliye
  const bookid = bookstore.find((value) => value.id == book);
  res.send(bookid);
});

apple.post("/books", (req, res) => {
  bookstore.push(req.body);
  res.send("Book added successfully");
  console.log(bookstore);
  
});

// Server Restart hone par pushed object bookstore mein nahi dikhayega , kyunki added object RAM mein store hota h aur jaise hi humlog wapas server restart krte h ram khaali ho jaata h aur naya server create ho jaata h ,phir wapas post krna padega tab jaakar dikhayega 
// Isiliye humein Secondary Memory (DB) ki jarurat h ki restart krne par server ko data na udd jaye  
  

