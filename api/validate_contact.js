const { parse } = require('querystring');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // This allows any domain to access your serverless function
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK'); // Respond OK to preflight requests
  }


module.exports = async (req, res) => {
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

    // Check for URLs in any text inputs
    if (Object.values(formData).some(value => containsURL(value))) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'URLs not allowed' }));
    }

    // Required fields validation
    const requiredFields = ['full_name', 'email', 'phone', 'years', 'native', 'find_out'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing required fields', missingFields }));
    }

    // Phone number validation
    if (!isValidPhoneNumber(formData.phone)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid phone number format' }));
    }

    // Specific logic for "2～3歳児"
    if (formData.years === "2～3歳児" && !formData.age) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Age required for 2～3歳児' }));
    }

    // Forward the validated data to your email-sending service
    fetch('https://bs-contact.vercel.app/api/send_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body, // Forward the original body received
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
