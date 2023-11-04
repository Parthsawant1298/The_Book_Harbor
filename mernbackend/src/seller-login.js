const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

require("./db/conn");

const PORT = 8888; // Replace with your desired port number
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const Seller = require('./model/seller');

app.post('/seller-login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const seller = await Seller.findOne({ email: email });
        if (seller && seller.password === password) {
            res.status(201).redirect("http://localhost:1000"); // Redirect to a success page or dashboard
        } else {
            res.status(400).redirect("/stylesheet/tryagain.html"); // Correct the URL to the "tryagain.html" page
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

app.get('/', (req, res) => {
    res.render('seller-login'); // Render the seller-login view
});

app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
});
