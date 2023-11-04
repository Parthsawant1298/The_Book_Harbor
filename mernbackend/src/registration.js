const express = require("express");
const app = express();
const bodyParser = require('body-parser');

require("./db/conn");

const PORT = 9000; // Replace 3000 with your desired port number
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/', (req, res) => {
    res.render('registration');
});
app.get('/login', (req, res) => {
  res.render('login');
});

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});
// app.js
const User = require('./model/user');

// ...

app.post('/register', (req, res) => {
  const { firstname,lastname,contactnumber,email,password,confirmpassword,gender,role,secretkey} = req.body;
  if(role=='admin')
  {
    if(secretkey!=='bookharbour')
    {
      return res.send('Incorrect secret key.Registration Failed!');
    }
  }

  const newUser1 = new User({
    firstname,
    lastname,
    contactnumber,
    email,
    password,
    confirmpassword,
    gender, // Should be "male" or "female" based on radio button selection
    role,
  });

  newUser1
  .save()
  .then(() => {
    res.redirect("http://localhost:3000/");
  })
  .catch((err) => {
    console.error(err);
    res.send('Registration failed.');
  });

  });

