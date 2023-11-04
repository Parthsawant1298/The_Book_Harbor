const mongoose = require('mongoose');

// Define the review schema
const reviewSchema = new mongoose.Schema({
    username: String,
    rating: String,
    review: String,
});

// Create the Review model based on the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
