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

const PORT = 1000;

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

// Configure Multer for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('sell');
});

app.post('/sell', upload.array('files', 10), (req, res) => {
  const productName = req.body.productName;
  const productDescription = req.body.productDescription;
  const productPrice = req.body.productPrice;

  // Create an array to store attachments
  const attachments = [];

  // Iterate over the uploaded files
  for (const file of req.files) {
    attachments.push({
      filename: file.originalname,
      content: file.buffer, // Use the file's buffer as content
    });
  }

  const mailOptions = {
    from: 'sawant.parth15@gmail.com',
    to: 'bookharbour2@gmail.com',
    subject: 'New Product Listing',
    text: `Product Name: ${productName}\nProduct Description: ${productDescription}\nPrice: ${productPrice}`,
    attachments: attachments,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('/stylesheet/seldisplay.html');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
