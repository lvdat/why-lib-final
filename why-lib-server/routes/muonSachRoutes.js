const express = require('express')
const router = express.Router()
const muonSachController = require('../controllers/muonSachController')
const auth = require('../middleware/auth')
const role = require('../middleware/role')

// @route   POST api/muonsach
// @desc    Tạo yêu cầu mượn sách
// @access  Private (Đọc giả)
router.post(
    '/',
    auth,
    role.checkRole(['docgia']),
    muonSachController.taoYeuCauMuon
)

// @route   PUT api/muonsach/:id/duyet
// @desc    Duyệt yêu cầu mượn sách
// @access  Private (Nhân viên)
router.put(
    '/:id/duyet',
    auth,
    role.checkRole(['nhanvien', 'quantri']),
    muonSachController.duyetMuonSach
)

// @route   PUT api/muonsach/:id/tra
// @desc    Xác nhận trả sách
// @access  Private (Nhân viên)
router.put(
    '/:id/tra',
    auth,
    role.checkRole(['nhanvien', 'quantri']),
    muonSachController.xacNhanTraSach
)

// @route   GET api/muonsach
// @desc    Lấy tất cả yêu cầu mượn sách
// @access  Private (Nhân viên/Quản lý)
router.get(
    '/',
    auth,
    role.checkRole(['nhanvien', 'quantri']),
    muonSachController.getAllMuonSach
)

// @route   GET api/muonsach/docgia/:id
// @desc    Lấy yêu cầu mượn sách của đọc giả
// @access  Private (Đọc giả hoặc nhân viên/quản lý)
router.get(
    '/docgia/:id',
    auth,
    (req, res, next) => {
        if (req.user.role === 'docgia' && req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn chỉ có thể xem thông tin mượn sách của chính mình'
            })
        }
        next()
    },
    muonSachController.getMuonSachByDocGia
)

module.exports = router
