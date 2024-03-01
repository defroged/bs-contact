const { parse } = require('querystring');
const fetch = require('node-fetch');
const cors = require('micro-cors')();

const validateContact = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).send('OK');
    return;
  }

  // Helper functions
  const containsURL = (value) => {
    const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/;
    return urlPattern.test(value);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^0\d{2}-\d{4}-\d{4}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const formData = parse(body);

    if (Object.values(formData).some(value => containsURL(value))) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'URLs not allowed' }));
    }

    const requiredFields = ['full_name', 'email', 'phone', 'years', 'native', 'find_out'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing required fields', missingFields }));
    }

    if (!isValidPhoneNumber(formData.phone)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid phone number format' }));
    }

    if (formData.years === "2～3歳児" && !formData.age) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Age required for 2～3歳児' }));
    }

    fetch('https://bs-contact.vercel.app/api/send_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body,
    })
    .then(response => response.json())
    .then(data => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    })
    .catch(error => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Internal server error' }));
    });
  });
};

module.exports = cors(validateContact);