const { parse } = require('querystring');
const axios = require('axios');
const cors = require('micro-cors')();

const validateContact = async (req, res) => {
  try {
    console.log('Request method:', req.method);
    if (req.method === 'OPTIONS') {
      res.status(200).send('OK');
      return;
    }

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

    req.on('end', async () => {
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

      try {
        const response = await axios.post('https://bs-contact.vercel.app/api/send_email', body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Error while sending email:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } catch (error) {
    console.error('General error:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
};

module.exports = cors(validateContact);