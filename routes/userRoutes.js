const express = require('express');
const userController = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken');

const router = express.Router();

// Register a new user
router.post('/register', userController.register);

// Authenticate and login the user, returning a JWT
router.post('/login', userController.login);

module.exports = router;
