const express = require("express");
const app = express();
const bodyParser = require('body-parser');

require("./db/conn");

const PORT = 3000; // Replace 3000 with your desired port number
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const User = require('./model/user');

app.post('/login', async (req, res) => { 
    try {
        const email = req.body.email;
        const password = req.body.password;
  
        const user = await User.findOne({ email: email }); 
        if (user && user.password === password) { 
            res.status(201).redirect("http://localhost:8080");
        } else {
            res.status(400).redirect("/stylesheet/tryagain.html");
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
  });


app.get('/', (req, res) => {
  res.render('login');
});




app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
});