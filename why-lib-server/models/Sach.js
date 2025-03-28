const mongoose = require('mongoose')

const SachSchema = new mongoose.Schema(
    {
        MASACH: { type: String, required: true, unique: true },
        TENSACH: { type: String, required: true },
        DONGIA: { type: Number, required: true },
        SOQUYEN: { type: Number, required: true, min: 0 },
        NAMXUATBAN: { type: Number, required: true },
        MANXB: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NhaXuatBan',
            required: true
        },
        TACGIA: { type: String, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Sach', SachSchema)
