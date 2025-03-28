const DocGia = require('../models/DocGia')

// Lấy tất cả đọc giả
exports.getAllDocGia = async (req, res) => {
    try {
        const docGias = await DocGia.find().select('-password')
        res.json({ success: true, docGias })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy đọc giả theo ID
exports.getDocGiaById = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.params.id).select('-password')
        if (!docGia) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy đọc giả' })
        }
        res.json({ success: true, docGia })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Cập nhật đọc giả
exports.updateDocGia = async (req, res) => {
    const { HOLOT, TEN, NGAYSINH, PHAI, DIACHI, DIENTHOAI } = req.body

    try {
        const docGia = await DocGia.findByIdAndUpdate(
            req.params.id,
            { HOLOT, TEN, NGAYSINH, PHAI, DIACHI, DIENTHOAI },
            { new: true }
        ).select('-password')

        if (!docGia) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy đọc giả' })
        }

        res.json({ success: true, docGia })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Xóa đọc giả
exports.deleteDocGia = async (req, res) => {
    try {
        const docGia = await DocGia.findByIdAndDelete(req.params.id)
        if (!docGia) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy đọc giả' })
        }
        res.json({ success: true, message: 'Đã xóa đọc giả thành công' })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}
