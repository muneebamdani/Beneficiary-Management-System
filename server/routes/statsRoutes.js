const express = require('express');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const Beneficiary = require('../models/Beneficiary');

const router = express.Router();

router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, todayCount, statusStats] = await Promise.all([
    Beneficiary.countDocuments(),
    Beneficiary.countDocuments({ createdAt: { $gte: today } }),
    Beneficiary.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  ]);

  const breakdown = statusStats.reduce((acc, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalBeneficiaries: total,
      visitorsToday: todayCount,
      statusBreakdown: {
        pending: breakdown.pending || 0,
        'in-progress': breakdown['in-progress'] || 0,
        completed: breakdown.completed || 0
      }
    }
  });
});

module.exports = router;
