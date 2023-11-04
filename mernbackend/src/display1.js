// Import necessary modules and setup Express app
const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const Product = require('./model/product'); // Import your Mongoose model
const path = require('path');
let cartItems = [];
// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Import your database connection
require("./db/conn");

// Connect to your MongoDB database
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define a route to display products
app.use('/uploads', express.static('uploads'));

app.get('/display1', async (req, res) => {
  try {
    // Fetch product data from MongoDB
    const products = await Product.find();

    // Render the display.ejs template with the product data
    res.render('display1', { products });
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Define a route for the root path
app.get('/', (req, res) => {
  // You can add code to render a homepage or perform any other action here
  res.redirect('/display1'); // Redirect to the '/display' route
});
app.post('/cart', (req, res) => {
  const { productName, productPrice } = req.body;
  cartItems.push({ productName, productPrice });
  const cartTotal = calculateCartTotal();
  res.render('cart', { cartItems, cartTotal });
});

// Helper function to calculate the cart total
function calculateCartTotal() {
  return cartItems.reduce((total, item) => total + parseFloat(item.productPrice), 0);
}
// Define the port to listen on
const port = 8090;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
