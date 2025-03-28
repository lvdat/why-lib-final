const express = require('express')
const router = express.Router()
const sachController = require('../controllers/sachController')
const auth = require('../middleware/auth')
const role = require('../middleware/role')

// @route   POST api/sach
// @desc    Tạo sách mới
// @access  Private (Chỉ quản lý)
router.post('/', auth, role.checkRole(['quantri']), sachController.createSach)

// @route   GET api/sach
// @desc    Lấy tất cả sách
// @access  Public
router.get('/', sachController.getAllSach)

// @route   GET api/sach/:id
// @desc    Lấy sách theo ID
// @access  Public
router.get('/:id', sachController.getSachById)

// @route   PUT api/sach/:id
// @desc    Cập nhật sách
// @access  Private (Chỉ quản lý)
router.put('/:id', auth, role.checkRole(['quantri']), sachController.updateSach)

// @route   DELETE api/sach/:id
// @desc    Xóa sách
// @access  Private (Chỉ quản lý)
router.delete(
    '/:id',
    auth,
    role.checkRole(['quantri']),
    sachController.deleteSach
)

// @route   GET api/sach/search
// @desc    Tìm kiếm sách
// @access  Public
router.get('/search', sachController.searchSach)

module.exports = router
