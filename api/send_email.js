const nodemailer = require('nodemailer');
const querystring = require('querystring');

const sanitizeInput = (input) => {
  return String(input)
    .trim()
    .replace(/<script.*?>.*?<\/script>/igm, '')
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

async function handleFormSubmission(body) {
  const emailTo = "hello@bluestar-english.com";
  const emailSubject = "Blue Star お問い合わせ";

  const full_name = sanitizeInput(body.full_name);
  const child_name = sanitizeInput(body.child_name);
  const child_furi = sanitizeInput(body.child_furi);
  const email = sanitizeInput(body.email);
  const phone = sanitizeInput(body.phone);
  const years = sanitizeInput(body.years);
  const age = sanitizeInput(body.age);
  const native = sanitizeInput(body.native);
  const learning_duration = sanitizeInput(body.learning_duration);
  const find_out = sanitizeInput(body.find_out);
  const friend = sanitizeInput(body.friend);
  const taiken = sanitizeInput(body.taiken);
  const special_coupon = body.special_coupon ? sanitizeInput(body.special_coupon) : "no"; // Default to "no" if not provided
  const inquiry = sanitizeInput(body.inquiry);

  const emailBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { color: #333366; font-size: 15px; font-weight: bold; margin-top: 16px; }
    .content { margin-bottom: 8px; }
    .label { color: #333333; }
    .value { margin-left: 10px; }
  </style>
</head>
<body>
  <div class="content">
    <span class="header">お問い合わせ内容</span>
  </div>
  <div class="content">
    <span class="label">保護者のお名前:</span>
    <span class="value">${full_name}</span>
  </div>
  <div class="content">
    <span class="label">お子様のお名前:</span>
    <span class="value">${child_name}</span>
    <br>
    <span class="label">お子様のお名前（フリガナ）:</span>
    <span class="value">${child_furi}</span>
  </div>
  <div class="content">
    <span class="header">連絡先</span>
  </div>
  <div class="content">
    <span class="label">Email:</span>
    <span class="value">${email}</span>
    <br>
    <span class="label">電話:</span>
    <span class="value">${phone}</span>
  </div>
  <div class="content">
    <span class="header">教育情報</span>
  </div>
  <div class="content">
    <span class="label">学年:</span>
    <span class="value">${years}</span>
    <br>
    <span class="label">2～3歳児の年齢:</span>
    <span class="value">${age}</span>
    <br>
    <span class="label">帰国子女:</span>
    <span class="value">${native === 'yes' ? 'はい' : 'いいえ'}</span>
    <br>
    <span class="label">英語学習の経験:</span>
    <span class="value">${learning_duration}</span>
  </div>
  <div class="content">
    <span class="header">その他の情報</span>
  </div>
  <div class="content">
    <span class="label">知ったきっかけ:</span>
    <span class="value">${find_out}</span>
    <br>
    <span class="label">紹介者のお名前:</span>
    <span class="value">${friend}</span>
    <br>
    <span class="label">Special Coupon:</span>
    <span class="value">${special_coupon === 'yes' ? '持っている' : '持っていない'}</span>
  </div>
  <br>
  <div class="content">
    <span class="label">体験を申し込む:</span>
    <span class="value">${taiken === 'yes' ? 'はい' : 'いいえ'}</span>
  </div>
  <div class="content">
    <span class="header">お問い合わせ内容</span>
    <p>${inquiry}</p>
  </div>
</body>
</html>
`;

  const transporter = nodemailer.createTransport({
    host: 'ronward.sakura.ne.jp',
    port: 587,
    secure: false, // Set to false for STARTTLS
    requireTLS: true, // Ensure TLS is used
    auth: {
      user: 'hello@ronward.sakura.ne.jp',
      pass: 'SaoRon0207!',
    },
    logger: true, // Enable detailed logging
    debug: true   // Show debug output
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Use the same email as the authenticated user
    to: emailTo,
    subject: emailSubject,
    html: emailBody,
    replyTo: body.email
  };

  try {
    console.log('Sending email with the following options:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
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
      body = querystring.parse(body);
      console.log('Received form submission with the following data:', body);
      await handleFormSubmission(body);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (e) {
      console.error('Error processing form submission:', e);
      res.status(500).json({ error: 'Error processing form submission' });
    }
  });
};
