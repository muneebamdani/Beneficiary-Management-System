import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import serverless from 'serverless-http';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import beneficiaryRoutes from './routes/beneficiaryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

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

export default serverless(app);
