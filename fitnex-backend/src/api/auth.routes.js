const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/register', AuthController.register);
router.post('/login', (req, res, next) => {
  console.log('Login route hit');
  AuthController.login(req, res, next).catch(err => {
    console.error('Login controller error:', err);
    next(err);
  });
});

module.exports = router;
