const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/signup - Create new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

module.exports = router;