const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Set up Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB URI
const uri = 'mongodb://127.0.0.1:27017'; // Local MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = 'groceryDB';  // Database name
const collectionName = 'users';  // Collection name

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// SignUp Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  // Check if user already exists
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const existingUser = await collection.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    password: hashedPassword,
  };

  try {
    // Insert the new user into the database
    const result = await collection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  try {
    // Find user by email
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Start server and connect to MongoDB
app.listen(port, async () => {
  await connectToMongo();
  console.log(`Server running at http://localhost:${port}`);
});
