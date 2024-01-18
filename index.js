const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// MiddleWare

app.use(cors());
app.use(express.json());


// eventcrud
// w3BPzqAkCPg7sLGX





const uri = "mongodb+srv://eventcrud:w3BPzqAkCPg7sLGX@javascript.xigpsgh.mongodb.net/?retryWrites=true&w=majority";

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const eventCollection = client.db('eventDB').collection('event');


        // Create Data
        app.post('/event', async (req, res) => {

            const newEvent = req.body;
            console.log(newEvent);
            const result = await eventCollection.insertOne(newEvent);
            res.send(result);
        })

        // Read Data

        app.get('/event', async (req, res) => {
            const cursor = eventCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Delete
        app.delete('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await eventCollection.deleteOne(query);
            res.send(result);
        })

        // Update
        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await eventCollection.findOne(query);
            res.send(result);

        })

        app.put('/event/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedEvent = req.body;
            const event = {
                $set: {
                    title: updatedEvent.title,
                    type: updatedEvent.type,
                    description: updatedEvent.description,
                    startDate: updatedEvent.startDate,
                    endDate: updatedEvent.endDate
                }
            }

            const result = await eventCollection.updateOne(filter, event, options);
            res.send(result);



        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Alumni server is  running')
})

app.listen(port, () => {
    console.log(`Alumni is running on port:${port}`)
})
