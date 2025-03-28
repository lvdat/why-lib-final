const MuonSach = require('../models/MuonSach')
const Sach = require('../models/Sach')

// Tạo yêu cầu mượn sách
exports.taoYeuCauMuon = async (req, res) => {
    const { MASACH } = req.body
    const MADOCGIA = req.user.id

    try {
        // Kiểm tra sách có tồn tại và còn không
        const sach = await Sach.findById(MASACH)
        if (!sach) {
            return res
                .status(404)
                .json({ success: false, message: 'Sách không tồn tại' })
        }

        if (sach.SOQUYEN <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Sách đã hết, không thể mượn'
            })
        }

        // Kiểm tra đọc giả đã mượn sách này chưa
        const existing = await MuonSach.findOne({
            MADOCGIA,
            MASACH,
            TRANGTHAI: { $in: ['Chờ duyệt', 'Đã duyệt'] }
        })

        if (existing) {
            return res
                .status(400)
                .json({ success: false, message: 'Bạn đã mượn sách này rồi' })
        }

        // Tạo yêu cầu mượn
        const muonSach = new MuonSach({
            MADOCGIA,
            MASACH,
            TRANGTHAI: 'Chờ duyệt'
        })

        await muonSach.save()
        res.json({ success: true, muonSach })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Duyệt yêu cầu mượn sách
exports.duyetMuonSach = async (req, res) => {
    const { id } = req.params
    const { trangThai } = req.body
    const NHANVIENDUYET = req.user.id

    try {
        const muonSach = await MuonSach.findById(id).populate('MASACH')
        if (!muonSach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu mượn sách'
            })
        }

        if (trangThai === 'Đã duyệt') {
            // Giảm số lượng sách
            if (muonSach.MASACH.SOQUYEN <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Sách đã hết, không thể duyệt'
                })
            }
            muonSach.MASACH.SOQUYEN -= 1
            await muonSach.MASACH.save()
        }

        muonSach.TRANGTHAI = trangThai
        muonSach.NHANVIENDUYET = NHANVIENDUYET
        await muonSach.save()

        res.json({ success: true, muonSach })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Xác nhận trả sách
exports.xacNhanTraSach = async (req, res) => {
    const { id } = req.params
    const NHANVIENDUYET = req.user.id

    try {
        const muonSach = await MuonSach.findById(id).populate('MASACH')
        if (!muonSach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu mượn sách'
            })
        }

        if (muonSach.TRANGTHAI !== 'Đã duyệt') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể trả sách đã được duyệt'
            })
        }

        // Tăng số lượng sách
        muonSach.MASACH.SOQUYEN += 1
        await muonSach.MASACH.save()

        muonSach.TRANGTHAI = 'Đã trả'
        muonSach.NGAYTRA = Date.now()
        muonSach.NHANVIENDUYET = NHANVIENDUYET
        await muonSach.save()

        res.json({ success: true, muonSach })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy tất cả yêu cầu mượn sách
exports.getAllMuonSach = async (req, res) => {
    try {
        const muonSachs = await MuonSach.find()
            .populate('MADOCGIA', 'HOLOT TEN')
            .populate('MASACH', 'TENSACH')
            .populate('NHANVIENDUYET', 'HOTENNV')
        res.json({ success: true, muonSachs })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}

// Lấy yêu cầu mượn sách của đọc giả
exports.getMuonSachByDocGia = async (req, res) => {
    try {
        const muonSachs = await MuonSach.find({ MADOCGIA: req.params.id })
            .populate('MASACH', 'TENSACH DONGIA')
            .populate('NHANVIENDUYET', 'HOTENNV')
        res.json({ success: true, muonSachs })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
}
