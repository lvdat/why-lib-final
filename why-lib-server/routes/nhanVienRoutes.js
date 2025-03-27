const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVienController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// @route   POST api/nhanvien
// @desc    Tạo nhân viên mới
// @access  Private (Chỉ quản lý)
router.post('/', auth, role.checkRole(['quantri']), nhanVienController.createNhanVien);

// @route   GET api/nhanvien
// @desc    Lấy tất cả nhân viên
// @access  Private (Chỉ quản lý)
router.get('/', auth, role.checkRole(['quantri']), nhanVienController.getAllNhanVien);

// @route   GET api/nhanvien/:id
// @desc    Lấy nhân viên theo ID
// @access  Private (Quản lý hoặc chính nhân viên đó)
router.get('/:id', auth, (req, res, next) => {
  if (req.user.role === 'nhanvien' && req.user.id !== req.params.id) {
    return res.status(403).json({ 
      success: false, 
      message: 'Bạn chỉ có thể xem thông tin của chính mình' 
    });
  }
  next();
}, nhanVienController.getNhanVienById);

// @route   PUT api/nhanvien/:id
// @desc    Cập nhật nhân viên
// @access  Private (Quản lý hoặc chính nhân viên đó)
router.put('/:id', auth, (req, res, next) => {
  if (req.user.role === 'nhanvien' && req.user.id !== req.params.id) {
    return res.status(403).json({ 
      success: false, 
      message: 'Bạn chỉ có thể cập nhật thông tin của chính mình' 
    });
  }
  next();
}, nhanVienController.updateNhanVien);

// @route   DELETE api/nhanvien/:id
// @desc    Xóa nhân viên
// @access  Private (Chỉ quản lý)
router.delete('/:id', auth, role.checkRole(['quantri']), nhanVienController.deleteNhanVien);

module.exports = router;