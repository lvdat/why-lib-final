require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/db')

const app = express()

// Kết nối CSDL
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/docgia', require('./routes/docGiaRoutes'))
app.use('/api/sach', require('./routes/sachRoutes'))
app.use('/api/nhaxuatban', require('./routes/nhaXuatBanRoutes'))
app.use('/api/nhanvien', require('./routes/nhanVienRoutes'))
app.use('/api/muonsach', require('./routes/muonSachRoutes'))

// Xử lý lỗi 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Không tìm thấy trang' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`))
