const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const port = 4000; // Use the port you want
require("./db/conn");

const router = express.Router();
app.use(express.static('public'));
app.use(express.static(__dirname+'/public'));
const Product = require('./model/product'); // Define your product model

// Create a multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.render('prod');
});


// Define a route to handle form submissions
app.post('/prod', upload.fields([{ name: 'image' }, { name: 'pdf' }]), async (req, res) => {
  const { name, price, description } = req.body;
  const image = req.files['image'][0].filename;
  const pdf = req.files['pdf'][0].filename;

  try {
    // Create a new Product document and save it to MongoDB
    const product = new Product({
      name,
      price,
      description,
      image,
      pdf,
    });

    await product.save();
    res.redirect("/stylesheet/admin.html"); // Redirect to the product display page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving the product.');
  }
});
app.get('/display', async (req, res) => {
  try {
    // Fetch product data from MongoDB
    const products = await Product.find();

    // Render the display.ejs template with the product data
    res.render('display', { products });
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Other routes and middleware for displaying products, etc.
// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
