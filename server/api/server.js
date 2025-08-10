const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db.js');

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

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected');

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/beneficiaries', beneficiaryRoutes);
    app.use('/api/stats', statsRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ success: true, message: 'Server running' });
    });

    const PORT = process.env.PORT || 5000;
    console.log('PORT from env:', process.env.PORT);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
