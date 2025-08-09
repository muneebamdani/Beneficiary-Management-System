const express = require('express');
const { create, getAll, update } = require('../controllers/beneficiaryController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, authorizeRoles('admin', 'receptionist'), create);
router.get('/', authenticateJWT, getAll);
router.put('/:id', authenticateJWT, authorizeRoles('staff', 'admin'), update);

module.exports = router;
