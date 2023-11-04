const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  pdf: String,
});

const product = mongoose.model('product', productSchema);

module.exports = product;
