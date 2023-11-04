const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import Mongoose
const path = require('path');

const Review = require('./model/review'); // Replace with the actual path
// Import your review schema
require("./db/conn");
// Connect to your MongoDB database


const PORT = 7070; // Replace with your desired port number

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    // Fetch and display existing reviews
    Review.find()
        .then((reviews) => {
            res.render('review', { reviews });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error fetching reviews.');
        });
});

app.post('/review', (req, res) => {
    const { username, rating, review } = req.body;

    const newReview = new Review({
        username,
        rating,
        review,
    });

    newReview
        .save()
        .then(() => {
            // After saving the review, fetch all reviews and re-render the page
            return Review.find();
        })
        .then((reviews) => {
            res.render('review', { reviews });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Review submission failed.');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
});
