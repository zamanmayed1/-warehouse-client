const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())




const uri = "mongodb+srv://mayedstockroom:iePuKsxvX5t5tBfT@cluster0.2jmak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const Inventorycollecttion = client.db("Inventorycollecttion").collection("Inventory");


        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = Inventorycollecttion.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/myinventory', async (req, res) => {
            const email = req.query.email
            const query = { email: email };
            const cursor = Inventorycollecttion.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await Inventorycollecttion.findOne(query)
            res.send(result)
        })

        app.post('/additem', async (req, res) => {
            const item = req.body
            const result = await Inventorycollecttion.insertOne(item);
            res.send(result)

        })
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const updatedStock = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDocument = {
                $set: updatedStock
              };
              const result = await   Inventorycollecttion.updateOne(filter, updateDocument, options)
         
            res.send(result)

        })
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await Inventorycollecttion.deleteOne(query);
            res.send(result)

        })

    } finally {

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Stock Room Server ')
})
app.listen(port, () => {
    console.log("server is  running on ", port);
})