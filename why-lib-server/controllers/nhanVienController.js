const NhanVien = require('../models/NhanVien')
const bcrypt = require('bcryptjs')

// Tạo nhân viên mới (chỉ quản lý)
exports.createNhanVien = async (req, res) => {
    const { MSNV, HOTENNV, password, CHUCVU, DIACHI, SODIENTHOAI, email } =
        req.body

    try {
        // Kiểm tra email tồn tại
        let nhanVien = await NhanVien.findOne({ email })
        if (nhanVien) {
            return res
                .status(400)
                .json({ success: false, message: 'Email đã tồn tại' })
        }

        // Tạo nhân viên mới
        nhanVien = new NhanVien({
            MSNV,
            HOTENNV,
            password,
            CHUCVU,
            DIACHI,
            SODIENTHOAI,
            email
        })

        await nhanVien.save()
        res.status(201).json({ success: true, nhanVien })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy tất cả nhân viên
exports.getAllNhanVien = async (req, res) => {
    try {
        const nhanViens = await NhanVien.find().select('-password')
        res.json({ success: true, nhanViens })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy nhân viên theo ID
exports.getNhanVienById = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findById(req.params.id).select(
            '-password'
        )
        if (!nhanVien) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy nhân viên' })
        }
        res.json({ success: true, nhanVien })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Cập nhật nhân viên
exports.updateNhanVien = async (req, res) => {
    const { HOTENNV, CHUCVU, DIACHI, SODIENTHOAI } = req.body

    try {
        const nhanVien = await NhanVien.findByIdAndUpdate(
            req.params.id,
            { HOTENNV, CHUCVU, DIACHI, SODIENTHOAI },
            { new: true }
        ).select('-password')

        if (!nhanVien) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy nhân viên' })
        }

        res.json({ success: true, nhanVien })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Xóa nhân viên
exports.deleteNhanVien = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findByIdAndDelete(req.params.id)
        if (!nhanVien) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy nhân viên' })
        }
        res.json({ success: true, message: 'Đã xóa nhân viên thành công' })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}
