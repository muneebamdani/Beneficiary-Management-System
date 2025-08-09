const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

module.exports = serverless(app);
