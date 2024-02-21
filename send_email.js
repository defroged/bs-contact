const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Port number can be changed as needed

app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // SMTP host
  port: 587, // SMTP port
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@example.com', // your email
    pass: 'your-password' // your email password
  }
});

// Sanitize input function equivalent in JavaScript
const sanitizeInput = (input) => {
  return String(input)
    .trim()
    .replace(/<script.*?>.*?<\/script>/igm, '') // Basic XSS prevention
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

app.post('/', (req, res) => {
  const emailTo = "hello@bluestar-english.com";
  const emailSubject = "New contact form submission";

// Collect and sanitize input
const full_name = sanitizeInput(req.body.full_name);
const child_name = sanitizeInput(req.body.child_name);
const child_furi = sanitizeInput(req.body.child_furi);
const email = sanitizeInput(req.body.email);
const phone = sanitizeInput(req.body.phone);
const years = sanitizeInput(req.body.years);
const age = sanitizeInput(req.body.age);
const experience = sanitizeInput(req.body.experience);
const learning_duration = sanitizeInput(req.body.learning_duration);
const find_out = sanitizeInput(req.body.find_out);
const friend = sanitizeInput(req.body.friend);
const special_coupon = sanitizeInput(req.body.special_coupon);
const other_option = sanitizeInput(req.body.other_option);
const inquiry = sanitizeInput(req.body.inquiry);


  const emailBody = `
Full Name: ${full_name}
Child Name: ${child_name}
Child Name (Furigana): ${child_furi}
Email: ${email}
Phone: ${phone}
Years: ${years}
Age: ${age}
Experience: ${experience}
Learning Duration: ${learning_duration}
Find Out: ${find_out}
Friend: ${friend}
Special Coupon: ${special_coupon}
Other Option: ${other_option}
Inquiry: ${inquiry}
`;


  const mailOptions = {
    from: 'noreply@bluestar-english.com',
    to: emailTo,
    subject: emailSubject,
    text: emailBody,
    replyTo: req.body.email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send("Error sending email");
    } else {
      res.send("Email sent successfully");
    }
  });
});

app.use((req, res) => {
  res.status(405).send("Invalid request method");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
