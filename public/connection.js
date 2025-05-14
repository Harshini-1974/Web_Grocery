const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://127.0.0.1:27017';  // Change this if you're using a different host/port

// Create a new MongoClient instance
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB server
        await client.connect();
        console.log('Connected to MongoDB');

        // Access a specific database (will create it if it doesn't exist)
        const database = client.db('Grocery_1'); // Replace with your actual database name
        console.log(`Connected to database: ${database.databaseName}`);

        // Access a collection within the database (will create it if it doesn't exist)
        const collection = database.collection('connection'); // Replace with your collection name
        console.log(`Connected to collection: ${collection.collectionName}`);

        // Insert a document into the collection
        const document = { name: 'Apple', price: 1.99 };  // Example data, replace with your own
        const result = await collection.insertOne(document);
        console.log('Inserted document:', result.ops);

        // Retrieve all documents from the collection
        const foundDocuments = await collection.find({}).toArray();
        console.log('Documents in the collection:', foundDocuments);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Close the MongoDB connection
        await client.close();
        console.log('Connection closed');
    }
}

// Run the function
run().catch(console.error);
