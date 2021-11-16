const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4xr9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('niche_website');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('allOrders');

        // get all products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const product = await cursor.toArray();
            res.json(product);
        });

        // get single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query);
            res.json(product);
        })

        // get all order
        app.get('/allOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const product = await cursor.toArray();
            res.json(product);
        })

        // post  an order
        app.post('/allOrders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})