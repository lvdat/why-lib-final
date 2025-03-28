const express = require('express')
const router = express.Router()
const docGiaController = require('../controllers/docGiaController')
const auth = require('../middleware/auth')
const role = require('../middleware/role')

// @route   GET api/docgia
// @desc    Lấy tất cả đọc giả
// @access  Private (Quản lý)
router.get(
    '/',
    auth,
    role.checkRole(['quantri']),
    docGiaController.getAllDocGia
)

// @route   GET api/docgia/:id
// @desc    Lấy đọc giả theo ID
// @access  Private (Quản lý hoặc chính đọc giả đó)
router.get(
    '/:id',
    auth,
    (req, res, next) => {
        if (req.user.role === 'docgia' && req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn chỉ có thể xem thông tin của chính mình'
            })
        }
        next()
    },
    docGiaController.getDocGiaById
)

// @route   PUT api/docgia/:id
// @desc    Cập nhật đọc giả
// @access  Private (Quản lý hoặc chính đọc giả đó)
router.put(
    '/:id',
    auth,
    (req, res, next) => {
        if (req.user.role === 'docgia' && req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn chỉ có thể cập nhật thông tin của chính mình'
            })
        }
        next()
    },
    docGiaController.updateDocGia
)

// @route   DELETE api/docgia/:id
// @desc    Xóa đọc giả
// @access  Private (Chỉ quản lý)
router.delete(
    '/:id',
    auth,
    role.checkRole(['quantri']),
    docGiaController.deleteDocGia
)

module.exports = router
