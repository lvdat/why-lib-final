const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NhanVienSchema = new mongoose.Schema({
  MSNV: { type: String, required: true, unique: true },
  HOTENNV: { type: String, required: true },
  password: { type: String, required: true },
  CHUCVU: { type: String, enum: ['Nhân viên', 'Quản lý'], default: 'Nhân viên' },
  DIACHI: { type: String, required: true },
  SODIENTHOAI: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

// Hash password before saving
NhanVienSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('NhanVien', NhanVienSchema);