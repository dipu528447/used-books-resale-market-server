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
        const users = client.db("used-books-resale-market").collection("users");
        const categories = client.db("used-books-resale-market").collection("categories");
        const products = client.db("used-books-resale-market").collection("products");
        const orders=client.db("used-books-resale-market").collection("orders");
        app.post('/jwt',(req,res)=>{
            // console.log(req.body.email)
            const currentUSer=req.body;
            const token=jwt.sign(currentUSer,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
            res.send({token})
        })

        app.post('/addUser', async (req, res) => {

            
            const newUser = req.body;
            // console.log(newUser)
            const query={
              email:newUser.email
            }
            const alreadySignin=await users.findOne(query)
            console.log(alreadySignin)
            if(alreadySignin?.email){
              return res.send('')
            }
            const result = await users.insertOne(newUser);
            res.send(result);
          });

          app.post('/addProduct', async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct)
            const result = await products.insertOne(newProduct);
            res.send(result);
          });
          app.post('/addOrder', async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct)
            const result = await orders.insertOne(newProduct);
            res.send(result);
          });

        app.get('/getUsers', async (req,res)=>{
          let query={}
          // console.log(req.query.email)
          if(req.query.email){
              query={
                  email:req.query.email
              }
          }
          const cursor=users.find(query);
          const result=await cursor.toArray();
          // console.log(result);
          res.send(result)
        })
        app.get('/myproducts/:email',async(req,res)=>{
          const {email}=req.params;
          // console.log(email)
          const query={seller_id:email,status:"1"}
          const cursor=products.find(query);
          const result=await cursor.toArray();
          if(result){
            res.send(result)
          }
          
          
        })
        app.get('/myorder/:email',async(req,res)=>{
          const {email}=req.params;
          // console.log(email)
          const query={buyer_id:email}
          const cursor=orders.find(query);
          const result=await cursor.toArray();
          res.send(result)
        })
        app.get('/advertise',async(req,res)=>{
          
          const query={advertize:"1", status:"1"}
          const cursor=products.find(query);
          const result=await cursor.toArray();
          res.send(result)
        })
        app.get('/gallery',async(req,res)=>{
          
          const query={ status:"1" }
          const cursor=products.find(query);
          const result=await cursor.toArray();
          res.send(result)
        })
        app.get('/categories', async (req,res)=>{
          let query={}
          const cursor=categories.find(query);
          const result=await cursor.toArray();
          // console.log(result);
          res.send(result)
        })

        app.get('/category/:id', async (req,res)=>{
          const {id}=req.params;
          // console.log(id)
          const query={category_id:id};
          const cursor=products.find(query);
          const result=await cursor.toArray();
          // console.log(result);
          res.send(result)
        })
        app.get('/allSellers', async (req,res)=>{
          
          const query={type:'seller'};
          const cursor=users.find(query);
          const result=await cursor.toArray();
          // console.log(result);
          res.send(result)
        })
        app.get('/allBuyers', async (req,res)=>{
          
          const query={type:'buyer'};
          const cursor=users.find(query);
          const result=await cursor.toArray();
          // console.log(result);
          res.send(result)
        })

        app.get('/user/:email', async (req,res)=>{
          const {email}=req.params;
          let query={email:email}
          
          const result=await users.findOne(query);
          // console.log(result);
          res.send(result)
        })
        app.delete('/product/:id', async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)}
          const result=await products.deleteOne(filter);
          res.send(result)
        })
        app.delete('/order/:id', async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)}
          const result=await orders.deleteOne(filter);
          res.send(result)
        })
        app.delete('/deleteUser/:id', async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)}
          const result=await users.deleteOne(filter);
          res.send(result)
        })
        app.put('/product/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) }
          const options = { upsert: true };
          const updatedDoc = {
              $set: {
                  advertize: '1'
              }
          }
          const result = await products.updateOne(filter, updatedDoc, options);
          res.send(result);
      });

        app.put('/verify/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) }
          const options = { upsert: true };
          const updatedDoc = {
              $set: {
                  verified: '1'
              }
          }
          const result = await users.updateOne(filter, updatedDoc, options);
          res.send(result);
      });
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