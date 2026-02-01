const express = require("express");
const app = express();

app.listen(4000, (req, res) => {
  console.log("Listening at port no 4000");
});

app.use(express.json());

const bookstore = [
  { id: 1, bookname: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, bookname: "Atomic Habits", author: "James Clear" },
  { id: 3, bookname: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki" },
  { id: 4, bookname: "Ikigai", author: "Héctor García & Francesc Miralles" },
  { id: 5, bookname: "The Power of Now", author: "Eckhart Tolle" },
  { id: 6, bookname: "Think and Grow Rich", author: "Napoleon Hill" },
  {
    id: 7,
    bookname: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
  },
  { id: 8, bookname: "Deep Work", author: "Cal Newport" },
  { id: 9, bookname: "Sapiens", author: "Yuval Noah Harari" },
  { id: 10, bookname: "The Psychology of Money", author: "Morgan Housel" },
];

app.get("/book", (req, res) => {
  
res.send(bookstore)
  
});

app.get("/book/query", (req, res) => {
  
  bookstore.forEach((value)=>{
    if(req.query.bookname===value.bookname)
      res.send(value);

  })
  
});

app.patch("/book", (req, res) => {
  bookstore.forEach((value, index) => {
    if (value.id === req.body.id) {
      //   value = req.body; this won't work because value isn't the original object it is just pointing the object , so if changes are made it doesn't matter because the changes doesn't affect the original object.
      bookstore[index].author = req.body.author;
      bookstore[index].bookname = req.body.bookname;
    }
  });

  res.send(bookstore);
  // res.send("patch done");
});

app.put("/book", (req, res) => {
  bookstore.forEach((value, index) => {
    if (value.id === req.body.id) {
      //   value = req.body; this won't work because value isn't the original object it is just pointing the object , so if changes are made it doesn't matter because the changes doesn't affect the original object.
      bookstore[index] = req.body;
    }
  });

  res.send(bookstore);
  // res.send("patch done");
});

app.delete("/book/:id", (req, res) => {
  bookstore.forEach((value, index) => {
    if (value.id === Number(req.params.id)) {
      bookstore.splice(index, 1);
    }
  });

  res.send(bookstore);
  // res.send("patch done");
});


