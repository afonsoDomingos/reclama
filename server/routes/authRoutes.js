const express = require('express');
const { register, login, getMe } = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// Note: me route will need auth middleware later
router.get('/me', getMe);

module.exports = router;
