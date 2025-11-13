const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://dbUserMk:123%40456%23mK@cluster0.0h8qk0h.mongodb.net/?appName=Cluster0";
//
//mongo pass = 123@456#mK

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
        const db = client.db('modeldb')
        const modelCollection = db.collection('models')
        //get
        app.get('/models', async (req, res) => {
            const result = await modelCollection.find().toArray()
            res.send(result)
        })

        //post 
        app.post('/models', async (req, res) => {
            try {
                const data = req.body;
                const result = await modelCollection.insertOne(data);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Failed to insert document' });
            }
        });

        //get single items form server 
        app.get('/models/:id', async (req, res) => {
            const id = req.params
            const result = await modelCollection.findOne({ _id: new ObjectId(id) })
            res.send({
                success: true,
                result
            })
        });
        //update model 
        app.put('/models/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const data = req.body;

                const result = await modelCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: data }
                );

                res.send({
                    success: true,
                    modifiedCount: result.modifiedCount
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({ success: false, message: 'Failed to update document' });
            }
        });
        //delete operation 
        app.delete('/models/:id', async (req, res) => {
            try {
                const { id } = req.params;

                const result = await modelCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount > 0) {
                    res.send({ success: true });
                } else {
                    res.status(404).send({ success: false, message: 'Model not found' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ success: false, message: 'Failed to delete document' });
            }
        });




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(' Ai Server Started Succesfully ')
})

app.listen(port, () => {
    console.log(`Ai Server Started Succesfully on port  ${port}`)
})
