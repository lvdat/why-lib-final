const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DocGiaSchema = new mongoose.Schema({
  MADOCGIA: { type: String, required: true, unique: true },
  HOLOT: { type: String, required: true },
  TEN: { type: String, required: true },
  NGAYSINH: { type: Date, required: true },
  PHAI: { type: String, enum: ['Nam', 'Nữ'], required: true },
  DIACHI: { type: String, required: true },
  DIENTHOAI: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
DocGiaSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('DocGia', DocGiaSchema);