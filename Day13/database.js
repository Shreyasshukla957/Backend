const { MongoClient } = require("mongodb");

async function runGetStarted() {
  // Replace the uri string with your connection string
  const uri =
    "mongodb+srv://shreyasdb:merapassword@codingnow.vdqgxp8.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // these two make connections when documents is called
    const database = client.db("Codingme");
    const users = database.collection("user");

    // this query is given to ask for document consisting name:Shreyas
    // const query = { name: "Shreyas" };

    // 'find' is use instead of 'findOne' when all document is needed.
    // agar .toArray nahi lagya toh woh network call jaayega hi nahi ,
    //  (.Array) network call krta h
    // aur jab yeh documents call hota h ussi time par 'database' aur 'users' check hota h ki exist krta h ki nahi
    //  const documents =  users.find({})
    //  for await(const doc of documents){
    //     console.log(doc);
    //  }
    //    console.log(result);

    // inserting single data to database
    // const insertResult = await users.insertOne({name:"Rahul",age:20});
    // console.log( "inserted document =>", insertResult);

    // inserting multiple data to database
    const insertResultmany = await users.insertMany(
      { name: "Rahul", age: 29 },
      { name: "Ram", age: 24 },
      { name: "Radha", age: 22 },
    );
    console.log("inserted document =>", insertResultmany);
  } finally {
    await client.close();
  }
}
runGetStarted().catch(console.dir);
