const express = require('express')
 const cors = require('cors');
const app = express()
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbmojlp.mongodb.net/?appName=Cluster0`;
const port = process.env.PORT ||5000

// middle Ware 
app.use(cors());
app.use(express.json())

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();


    const db = client.db("book-crafters");
    const booksCollection = db.collection("books");

    //  book api 
    //latest biooks
   app.get('/latestbooks',async(req,res)=>{
     try {
        const options = {
            sort: { dateAdded: -1 },
             limit: 6
        };
        const cursor = booksCollection.find({}, options);
        const result = await cursor.toArray();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch books" });
    }
   })

  //  all books amd query email 
   app.get('/books',async(req,res)=>{
     try {
        const options = {
            sort: { dateAdded: -1 },
           
        }
         const query ={}
        const email = req.query.email
       
        if(email){
          query.email = email
        }
        const cursor = booksCollection.find(query, options);
        const result = await cursor.toArray();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch books" });
    }
   })

      // book details 
   app.get('/books/:id',async(req,res)=>{
   try{
     const id = req.params.id;
    const query = {_id :new ObjectId(id)}
    const result = await booksCollection.findOne(query)
    res.send(result)
   }
   catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch books" });
    }
   })




  //  add books 

    app.post('/books',async(req,res)=>{
      try{
        const newBook = req.body
         if (typeof newBook.tags === "string") {
         newBook.tags = newBook.tags.split(",").map(tag => tag.trim());
          }
          newBook.dateAdded = new Date();
       const result = await booksCollection.insertOne(newBook)
       res.send(result)
      }
       catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
      }
    })

    // delete  api 

    app.delete('/books/:id',async(req,res)=>{
      
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await booksCollection.deleteOne(query)
       res.send(result)
    })

   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Book Crafter Server is runnng')
})

app.listen(port, () => {
  console.log(`Book Crafter Server is runnng on port ${port}`)
})
