const jwt = require('jsonwebtoken');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');

module.exports = async (req, res, next) => {
  // Lấy token từ header
  const token = req.header('x-auth-token');

  // Kiểm tra nếu không có token
  if (!token) {
    return res.status(401).json({ success: false, message: 'Không có token, truy cập bị từ chối' });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong database
    let user;
    if (decoded.user.role === 'docgia') {
      user = await DocGia.findById(decoded.user.id).select('-password');
    } else {
      user = await NhanVien.findById(decoded.user.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }

    // Gán user vào request
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};