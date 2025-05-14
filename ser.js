const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dummy product data
let products = [
  { id: 1, name: "Apple", category: "Fruits", price: 100, image: "/images/apple.jpg" },
  { id: 2, name: "Banana", category: "Fruits", price: 40, image: "/images/banana.jpg" },
  { id: 3, name: "Milk", category: "Dairy", price: 50, image: "/images/milk.jpg" },
  { id: 4, name: "Cheese", category: "Dairy", price: 80, image: "/images/cheese.jpg" },
  { id: 5, name: "Chips", category: "Snacks", price: 30, image: "/images/chips.jpg" },
  { id: 6, name: "Cookies", category: "Snacks", price: 60, image: "/images/cookies.jpg" }
];

// API Route
app.get('/api/products', (req, res) => {
  const category = req.query.category;
  if (category) {
    const filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    res.json(filtered);
  } else {
    res.json(products);
  }
});

// Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'categories.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
