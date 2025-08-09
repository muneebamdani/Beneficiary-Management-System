const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const serverless = require('serverless-http');  // add this

const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes.js");
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const statsRoutes = require('./routes/statsRoutes');

dotenv.config();
const app = express();

app.use(cors({
  origin: ['https://beneficiary-management-system-ten.vercel.app'],
  credentials: true
}));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

// Remove app.listen() entirely

// Export the handler for Vercel serverless
module.exports.handler = serverless(app);
