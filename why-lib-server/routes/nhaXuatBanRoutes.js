const express = require('express')
const router = express.Router()
const nhaXuatBanController = require('../controllers/nhaXuatBanController')
const auth = require('../middleware/auth')
const role = require('../middleware/role')

// @route   POST api/nhaxuatban
// @desc    Tạo nhà xuất bản mới
// @access  Private (Chỉ quản lý)
router.post(
    '/',
    auth,
    role.checkRole(['quantri']),
    nhaXuatBanController.createNhaXuatBan
)

// @route   GET api/nhaxuatban
// @desc    Lấy tất cả nhà xuất bản
// @access  Public
router.get('/', nhaXuatBanController.getAllNhaXuatBan)

// @route   GET api/nhaxuatban/:id
// @desc    Lấy nhà xuất bản theo ID
// @access  Public
router.get('/:id', nhaXuatBanController.getNhaXuatBanById)

// @route   PUT api/nhaxuatban/:id
// @desc    Cập nhật nhà xuất bản
// @access  Private (Chỉ quản lý)
router.put(
    '/:id',
    auth,
    role.checkRole(['quantri']),
    nhaXuatBanController.updateNhaXuatBan
)

// @route   DELETE api/nhaxuatban/:id
// @desc    Xóa nhà xuất bản
// @access  Private (Chỉ quản lý)
router.delete(
    '/:id',
    auth,
    role.checkRole(['quantri']),
    nhaXuatBanController.deleteNhaXuatBan
)

module.exports = router
