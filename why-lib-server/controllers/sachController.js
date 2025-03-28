const Sach = require('../models/Sach')
const NhaXuatBan = require('../models/NhaXuatBan')
const MuonSach = require('../models/MuonSach')

// Tạo sách mới
exports.createSach = async (req, res) => {
    const { MASACH, TENSACH, DONGIA, SOQUYEN, NAMXUATBAN, MANXB, TACGIA } =
        req.body

    try {
        // Kiểm tra MASACH đã tồn tại chưa
        let sach = await Sach.findOne({ MASACH })
        if (sach) {
            return res
                .status(400)
                .json({ success: false, message: 'Mã sách đã tồn tại' })
        }

        // Kiểm tra NXB có tồn tại không
        const nxb = await NhaXuatBan.findById(MANXB)
        if (!nxb) {
            return res
                .status(404)
                .json({ success: false, message: 'NXB không tồn tại' })
        }

        // Tạo sách mới
        sach = new Sach({
            MASACH,
            TENSACH,
            DONGIA,
            SOQUYEN,
            NAMXUATBAN,
            MANXB,
            TACGIA
        })

        await sach.save()
        res.status(201).json({ success: true, sach })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy tất cả sách
exports.getAllSach = async (req, res) => {
    try {
        const sachs = await Sach.find().populate('MANXB', 'TENNXB')
        res.json({ success: true, sachs })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy sách theo ID
exports.getSachById = async (req, res) => {
    try {
        const sach = await Sach.findById(req.params.id).populate(
            'MANXB',
            'TENNXB DIACHI'
        )
        if (!sach) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy sách' })
        }
        res.json({ success: true, sach })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Cập nhật sách
exports.updateSach = async (req, res) => {
    const { TENSACH, DONGIA, SOQUYEN, NAMXUATBAN, MANXB, TACGIA } = req.body

    try {
        // Kiểm tra NXB có tồn tại không (nếu có thay đổi MANXB)
        if (MANXB) {
            const nxb = await NhaXuatBan.findById(MANXB)
            if (!nxb) {
                return res
                    .status(404)
                    .json({ success: false, message: 'NXB không tồn tại' })
            }
        }

        const sach = await Sach.findByIdAndUpdate(
            req.params.id,
            { TENSACH, DONGIA, SOQUYEN, NAMXUATBAN, MANXB, TACGIA },
            { new: true }
        ).populate('MANXB', 'TENNXB')

        if (!sach) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy sách' })
        }

        res.json({ success: true, sach })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Xóa sách
exports.deleteSach = async (req, res) => {
    try {
        // Kiểm tra có ai đang mượn sách này không
        const muonSachCount = await MuonSach.countDocuments({
            MASACH: req.params.id,
            TRANGTHAI: { $in: ['Chờ duyệt', 'Đã duyệt'] }
        })
        if (muonSachCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa sách vì có người đang mượn'
            })
        }

        const sach = await Sach.findByIdAndDelete(req.params.id)
        if (!sach) {
            return res
                .status(404)
                .json({ success: false, message: 'Không tìm thấy sách' })
        }
        res.json({ success: true, message: 'Đã xóa sách thành công' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Tìm kiếm sách
exports.searchSach = async (req, res) => {
    const { keyword } = req.query

    try {
        const sachs = await Sach.find({
            $or: [
                { TENSACH: { $regex: keyword, $options: 'i' } },
                { TACGIA: { $regex: keyword, $options: 'i' } }
            ]
        }).populate('MANXB', 'TENNXB')

        res.json({ success: true, sachs })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}
