const NhaXuatBan = require('../models/NhaXuatBan');
const Sach = require('../models/Sach');

// Tạo nhà xuất bản mới
exports.createNhaXuatBan = async (req, res) => {
  const { MANXB, TENNXB, DIACHI } = req.body;

  try {
    // Kiểm tra MANXB đã tồn tại chưa
    let nxb = await NhaXuatBan.findOne({ MANXB });
    if (nxb) {
      return res.status(400).json({ success: false, message: 'Mã NXB đã tồn tại' });
    }

    // Tạo NXB mới
    nxb = new NhaXuatBan({
      MANXB,
      TENNXB,
      DIACHI
    });

    await nxb.save();
    res.status(201).json({ success: true, nxb });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy tất cả nhà xuất bản
exports.getAllNhaXuatBan = async (req, res) => {
  try {
    const nxbs = await NhaXuatBan.find();
    res.json({ success: true, nxbs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy nhà xuất bản theo ID
exports.getNhaXuatBanById = async (req, res) => {
  try {
    const nxb = await NhaXuatBan.findById(req.params.id);
    if (!nxb) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy NXB' });
    }
    res.json({ success: true, nxb });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật nhà xuất bản
exports.updateNhaXuatBan = async (req, res) => {
  const { TENNXB, DIACHI } = req.body;

  try {
    const nxb = await NhaXuatBan.findByIdAndUpdate(
      req.params.id,
      { TENNXB, DIACHI },
      { new: true }
    );

    if (!nxb) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy NXB' });
    }

    res.json({ success: true, nxb });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xóa nhà xuất bản
exports.deleteNhaXuatBan = async (req, res) => {
  try {
    // Kiểm tra có sách nào thuộc NXB này không
    const sachCount = await Sach.countDocuments({ MANXB: req.params.id });
    if (sachCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không thể xóa NXB vì có sách thuộc NXB này' 
      });
    }

    const nxb = await NhaXuatBan.findByIdAndDelete(req.params.id);
    if (!nxb) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy NXB' });
    }
    res.json({ success: true, message: 'Đã xóa NXB thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};