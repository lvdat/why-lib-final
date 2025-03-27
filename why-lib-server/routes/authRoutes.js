const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/register
// @desc    Đăng ký đọc giả
// @access  Public
router.post('/register', authController.registerDocGia);

// @route   GET api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get('/me', require('../middleware/auth'), authController.getMe);

module.exports = router;