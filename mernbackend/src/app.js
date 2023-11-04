const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

// Import necessary modules and setup the Express app
require('./db/conn');
const Product = require('./model/product');

const PORT = process.env.PORT || 8080; // Replace 8080 with your desired port number

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define an array to store cart items
const cartItems = [];

// Render the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Render the registration page
app.get('/registration', (req, res) => {
  res.render('registration');
});

// Render the login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle the search functionality
app.post('/search', async (req, res) => {
  const searchQuery = req.body.searchQuery;

  try {
    // Fetch data from MongoDB based on the search query
    const filteredData = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        // Add more fields to search as needed for different types of products
      ],
    });

    res.render('display1', { data: filteredData });
  } catch (error) {
    console.error('Error searching for data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display the search results
app.get('/display1', (req, res) => {
  res.render('display1', { data }); // Pass the data (filtered products) to the view
});

// Handle the cart functionality
app.get('/cart', (req, res) => {
  const cartTotal = calculateCartTotal();
  res.render('cart', { cartItems, cartTotal });
});

// Define a route to add items to the cart
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

app.listen(PORT, () => {
  console.log(`Server is running at port no ${PORT}`);
});
