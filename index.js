const express= require('express');
const cors=require('cors');
const app=express();
require('dotenv').config()
const jwt=require('jsonwebtoken');
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express());
app.use(cors());

app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hehvwbp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
 
  // perform actions on the collection object

  async function run(){
    try {
        const collection = client.db("used-books-resale-market").collection("users");
        app.post('/jwt',(req,res)=>{
            console.log(req.body.email)
            const currentUSer=req.body;
            const token=jwt.sign(currentUSer,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
            res.send({token})
        })

        app.post('/addUser', async (req, res) => {
      
            const newUser = req.body;
            console.log(newUser)
            const result = await collection.insertOne(newUser);
            res.send(result);
          });

          app.get('/getUsers', async (req,res)=>{
            let query={}
            console.log(req.query.email)
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor=collection.find(query);
            const result=await cursor.toArray();
            console.log(result);
            res.send(result)
          })
        app.get('/', async (req,res)=>{
            // const query={};
            // const cursor=db.find(query);
            // const service=await cursor.limit(3).toArray();
            res.send("hello world")
          })
      
        
    } catch (error) {
        
    }
  }
  run().catch(err=> console.log(err))
});



app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})