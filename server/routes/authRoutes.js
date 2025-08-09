const express = require('express');
const { login, signup } = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware'); // Verifies the token
const authorizeRoles = require('../middleware/roleMiddleware');   // Checks if role is 'admin'

const router = express.Router();

// Public login route
router.post('/login', login);

// router.post('/signup', signup);


// Protected signup route – only accessible if the user is logged in AND is an admin
router.post('/signup', authenticateJWT, authorizeRoles('admin'), signup);

module.exports = router;
