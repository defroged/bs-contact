// Import necessary libraries
const { parse } = require('querystring');

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

  // Parse request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const formData = parse(body);

    // Validation logic
    // Example: Check for URL in any text input
    if (Object.values(formData).some(value => containsURL(value))) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'URLs not allowed' }));
    }

    // Add other validations here (phone number, required fields, etc.)

    // If all validations pass, forward to email sending endpoint
    // You can use the `https` module or a library like `axios` to make the request
  });
};
