const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors())
app.use(express.json())



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

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await Inventorycollecttion.findOne(query)
            console.log(result);
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