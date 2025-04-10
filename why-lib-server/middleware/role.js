// Middleware kiểm tra role
exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập tài nguyên này',
                role: req.user.role
            })
        }
        next()
    }
}
