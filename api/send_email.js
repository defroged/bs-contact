const nodemailer = require('nodemailer');

const sanitizeInput = (input) => {
  return String(input)
    .trim()
    .replace(/<script.*?>.*?<\/script>/igm, '')
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

async function handleFormSubmission(body) {
  const emailTo = "hello@bluestar-english.com";
  const emailSubject = "New contact form submission";

  const full_name = sanitizeInput(body.full_name);
  const child_name = sanitizeInput(body.child_name);
  const child_furi = sanitizeInput(body.child_furi);
  const email = sanitizeInput(body.email);
  const phone = sanitizeInput(body.phone);
  const years = sanitizeInput(body.years);
  const age = sanitizeInput(body.age);
  const experience = sanitizeInput(body.experience);
  const learning_duration = sanitizeInput(body.learning_duration);
  const find_out = sanitizeInput(body.find_out);
  const friend = sanitizeInput(body.friend);
  const special_coupon = sanitizeInput(body.special_coupon);
  const other_option = sanitizeInput(body.other_option);
  const inquiry = sanitizeInput(body.inquiry);

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

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'noreply@bluestar-english.com',
    to: emailTo,
    subject: emailSubject,
    text: emailBody,
    replyTo: body.email
  };

  await transporter.sendMail(mailOptions);
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.bluestar-english.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', 'https://www.bluestar-english.com');

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      body = JSON.parse(body);
      await handleFormSubmission(body);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (e) {
      console.error('Error processing form submission:', e);
      res.status(500).json({ error: 'Error processing form submission' });
    }
  });
};