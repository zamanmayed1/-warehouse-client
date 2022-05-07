const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden' })
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2jmak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const Inventorycollecttion = client.db("Inventorycollecttion").collection("Inventory");
        // auth
        app.post('/login', (req, res) => {
            const email = req.body;
            if (email) {
                const accessToken = jwt.sign({ email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' })
                res.send({
                    success: true,
                    accessToken: accessToken
                })
            }
            else {
                res.status(401).send({ success: false });
            }
        })
        // All Item
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = Inventorycollecttion.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        // My Item with json web token
        app.get('/myinventory', verifyJWT, async (req, res) => {
            const email = req.query.email
            const query = { email: email };
            const cursor = Inventorycollecttion.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        // Item Details Api
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await Inventorycollecttion.findOne(query)
            res.send(result)
        })
        // Add Item Api
        app.post('/additem', async (req, res) => {
            const item = req.body
            const result = await Inventorycollecttion.insertOne(item);
            res.send(result)

        })
        // Update Stock Api
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const updatedStock = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDocument = {
                $set: updatedStock
            };
            const result = await Inventorycollecttion.updateOne(filter, updateDocument, options)

            res.send(result)

        })
        // Delete Item Api
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await Inventorycollecttion.deleteOne(query);
            res.send(result)

        })
        // Root Api
        app.get('/', (req, res) => {
            res.send('Stock Room Server IS Running On Heroku ')
        })

    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log("server is  running on heroku ", port);
})