require('dotenv').config();  // Load the .env file and access variables

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define the root route to serve the index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve the homepage
});

// Set up the contact form route to handle POST requests
app.post('/send-email', (req, res) => {
  const { fullname, email, message } = req.body;

  // Configure Nodemailer with credentials from environment variables
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Use the environment variable for email
      pass: process.env.EMAIL_PASS   // Use the environment variable for password
    }
  });

  const mailOptions = {
    from: email,  // Sender's email (from the form)
    to: process.env.EMAIL_USER,  // Recipient's email (your email from the .env)
    subject: 'New Contact Form Submission',
    text: `You have a new message from ${fullname} (${email}):\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error in sending email');
    }
    res.status(200).send('Email sent successfully');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
