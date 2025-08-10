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
  origin: ['https://beneficiary-app-muneeb-amdani.vercel.app'],
  credentials: true,
}));

app.use(express.json());

// Optional: Root route to avoid 404 at base URL
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected');

    // Register API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/beneficiaries', beneficiaryRoutes);
    app.use('/api/stats', statsRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ success: true, message: 'Server running' });
    });

    const PORT = process.env.PORT || 5001;
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
