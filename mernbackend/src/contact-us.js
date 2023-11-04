const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const credentials = require('./oauth2-credentials.json');
const { google } = require('googleapis');
const multer = require('multer'); // For handling file uploads

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = 5050;

const oauth2Client = new google.auth.OAuth2(
  credentials.clientId,
  credentials.clientSecret,
  credentials.redirectUri
);

oauth2Client.setCredentials({
  refresh_token: credentials.refreshToken,
  access_token: credentials.accessToken,
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: 'sawant.parth15@gmail.com', // Your Gmail email
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
    refreshToken: credentials.refreshToken,
    accessToken: credentials.accessToken,
  },
});

app.get('/', (req, res) => {
  res.render('contact-us');
});

app.post('/contact-us', (req, res) => {
  // Extract form data
  const { name, email, message } = req.body;
  
  // Compose the email
  const mailOptions = {
    from: 'sawant.parth15@gmail.com',
    to: 'bookharbour08@gmail.com',
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('http://localhost:8080');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
