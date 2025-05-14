const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'groceryDB';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

async function connectToMongo() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const db = client.db(dbName);
  const users = db.collection('users');

  const userExists = await users.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists.' });

  const hashed = await bcrypt.hash(password, 10);
  await users.insertOne({ name, email, password: hashed });

  res.status(201).json({ message: 'Signup successful' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const db = client.db(dbName);
  const users = db.collection('users');

  const user = await users.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  res.status(200).json({ message: 'Login successful', name: user.name, email: user.email });
});

app.post('/checkout', async (req, res) => {
  try {
    const { user, cart } = req.body;

    console.log("📦 Checkout request received");
    console.log("User:", user);
    console.log("Cart:", cart);

    if (!user || !Array.isArray(cart) || cart.length === 0) {
      console.warn("⚠️ Invalid request: Missing user or cart data.");
      return res.status(400).json({ message: 'Invalid request: Missing user or cart data.' });
    }

    const db = client.db(dbName);
    const users = db.collection('users');
    const orders = db.collection('Orders');

    const existingUser = await users.findOne({ email: user });
    if (!existingUser) {
      console.warn("❌ User not found in DB:", user);
      return res.status(401).json({ message: 'User not found. Please login again.' });
    }

    const order = {
      userEmail: user,
      items: cart,
      date: new Date(),
    };

    const result = await orders.insertOne(order);
    console.log("✅ Order inserted with ID:", result.insertedId);

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('🔥 Server error during checkout:', err);
    res.status(500).json({ message: 'Server error during checkout', error: err.message });
  }
});
// Add this to your server.js
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const db = client.db(dbName);
    const contacts = db.collection('contacts');

    await contacts.insertOne({
      name,
      email,
      subject,
      message,
      date: new Date(),
      status: 'new'
    });

    res.status(201).json({ message: 'Thank you for your message! We will get back to you soon.' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ message: 'Error submitting your message. Please try again.' });
  }
});

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/categories', (req, res) => res.sendFile(path.join(__dirname, 'public', 'categories.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cart.html')));
app.get('/payment', (req, res) => res.sendFile(path.join(__dirname, 'public', 'payment.html')));
// Add this with your other routes
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`Server running at http://localhost:${PORT}`);
});