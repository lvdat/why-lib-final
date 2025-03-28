const mongoose = require('mongoose')

const MuonSachSchema = new mongoose.Schema(
    {
        MADOCGIA: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DocGia',
            required: true
        },
        MASACH: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sach',
            required: true
        },
        NGAYMUON: { type: Date, default: Date.now },
        NGAYTRA: { type: Date },
        TRANGTHAI: {
            type: String,
            enum: ['Chờ duyệt', 'Đã duyệt', 'Đã trả', 'Từ chối'],
            default: 'Chờ duyệt'
        },
        NHANVIENDUYET: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' }
    },
    { timestamps: true }
)

module.exports = mongoose.model('MuonSach', MuonSachSchema)
