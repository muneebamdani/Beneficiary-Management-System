const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db.js');
const serverless = require('serverless-http');

const authRoutes = require('../routes/authRoutes.js');
const userRoutes = require('../routes/userRoutes.js');
const beneficiaryRoutes = require('../routes/beneficiaryRoutes.js');
const statsRoutes = require('../routes/statsRoutes.js');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://beneficiary-management-system-ten.vercel.app'],
  credentials: true,
}));

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

// no app.listen() here for serverless

module.exports = serverless(app);
