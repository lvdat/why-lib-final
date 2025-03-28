const DocGia = require('../models/DocGia')

exports.createDocGia = async (req, res) => {
    try {
        const {
            HOLOT,
            TEN,
            NGAYSINH,
            PHAI,
            DIACHI,
            DIENTHOAI,
            email,
            password
        } = req.body

        // Mã đọc giả sẽ được tự động sinh bởi Mongoose model
        const newDocGia = new DocGia({
            HOLOT,
            TEN,
            NGAYSINH,
            PHAI,
            DIACHI,
            DIENTHOAI,
            email,
            password
        })

        const savedDocGia = await newDocGia.save()
        res.status(201).json({
            success: true,
            docGia: savedDocGia
        })
    } catch (err) {
        if (err.code === 11000) {
            // Xử lý trường hợp trùng email
            return res.status(400).json({
                success: false,
                message: 'Email đã tồn tại'
            })
        }
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

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
