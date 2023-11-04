const express = require("express");
const app = express();
const bodyParser = require('body-parser');

require("./db/conn");

const PORT = 4200; // Replace 3000 with your desired port number
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req, res) => {
    res.render('seller-registration'); // Corrected the view file name
});

app.listen(PORT, () => {
  console.log(`Server is running at port no ${PORT}`);
});

const Seller = require('./model/seller');

app.post('/seller-registration', (req, res) => {
  const { name, email, password,} = req.body;

  const newSeller1 = new Seller({
    name,
    email,
    password,
  });

  newSeller1
    .save()
    .then(() => {
      res.redirect("http://localhost:8888"); // Update the port to 9000
    })
    .catch((err) => {
      console.error(err);
      res.send('Registration failed.');
    });
});
