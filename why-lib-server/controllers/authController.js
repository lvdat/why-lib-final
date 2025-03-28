const jwt = require('jsonwebtoken')
const DocGia = require('../models/DocGia')
const NhanVien = require('../models/NhanVien')
const bcrypt = require('bcryptjs')

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Kiểm tra đọc giả
        let user = await DocGia.findOne({ email })
        let role = 'docgia'

        // Nếu không phải đọc giả, kiểm tra nhân viên
        if (!user) {
            user = await NhanVien.findOne({ email })
            if (!user) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Email không tồn tại' })
            }
            role = user.CHUCVU === 'Quản lý' ? 'quantri' : 'nhanvien'
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: 'Mật khẩu không đúng' })
        }

        // Tạo token
        const payload = {
            user: {
                id: user.id,
                role: role,
                name: user.HOTENNV || `${user.HOLOT} ${user.TEN}`
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err
                res.json({ success: true, token, role, user: payload.user })
            }
        )
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Đăng ký đọc giả
exports.registerDocGia = async (req, res) => {
    const { HOLOT, TEN, NGAYSINH, PHAI, DIACHI, DIENTHOAI, email, password } =
        req.body

    try {
        // Kiểm tra email tồn tại
        let user = await DocGia.findOne({ email })
        if (user) {
            return res
                .status(400)
                .json({ success: false, message: 'Email đã tồn tại' })
        }

        // Tạo đọc giả mới
        user = new DocGia({
            HOLOT,
            TEN,
            NGAYSINH,
            PHAI,
            DIACHI,
            DIENTHOAI,
            email,
            password
        })

        await user.save()

        // Tạo token
        const payload = {
            user: {
                id: user.id,
                madocgia: user.MADOCGIA,
                role: 'docgia',
                name: `${user.HOLOT} ${user.TEN}`
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err
                res.json({
                    success: true,
                    token,
                    role: 'docgia',
                    user: payload.user
                })
            }
        )
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
    try {
        let user
        if (req.user.role === 'docgia') {
            user = await DocGia.findById(req.user.id).select('-password')
        } else {
            user = await NhanVien.findById(req.user.id).select('-password')
        }
        newJS = user.toObject()
        newJS.role = req.user.role
        res.json({ success: true, user: newJS})
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}
