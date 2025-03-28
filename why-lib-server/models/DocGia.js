const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');

const DocGiaSchema = new mongoose.Schema(
    {
        MADOCGIA: {
            type: String,
            default: () => `DG-${uuidv4().substring(0, 8)}`, // Tự động sinh mã DG- + 8 ký tự ngẫu nhiên
            unique: true,
            required: true
        },
        HOLOT: { type: String, required: true },
        TEN: { type: String, required: true },
        NGAYSINH: { type: Date, required: true },
        PHAI: { type: String, enum: ['Nam', 'Nữ'], required: true },
        DIACHI: { type: String, required: true },
        DIENTHOAI: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'docgia', required: true },
    },
    { timestamps: true }
)

// Hash password before saving
DocGiaSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

module.exports = mongoose.model('DocGia', DocGiaSchema)
