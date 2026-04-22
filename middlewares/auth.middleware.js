const jwt = require('jsonwebtoken');

/**
 * Middleware verifyToken: Kiểm tra tính hợp lệ của JWT
 * - Lấy token từ header Authorization (Bearer <token>)
 * - Giải mã bằng process.env.JWT_SECRET
 * - Trả về 403 nếu thiếu token, 401 nếu token sai/hết hạn
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Không tìm thấy token. Quyền truy cập bị từ chối.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        
        // Gán payload vào req.user
        req.user = decoded;
        next();
    });
};

/**
 * Middleware isAdmin: Kiểm tra quyền Quản trị viên
 * - Dựa trên req.user.RoleId (Admin = 1)
 * - Yêu cầu chạy sau verifyToken
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.RoleId === 1) {
        next();
    } else {
        return res.status(403).json({ message: 'Yêu cầu quyền Quản trị viên' });
    }
};

/**
 * Middleware isStudent: Kiểm tra quyền Sinh viên
 * - Dựa trên req.user.RoleId (Student = 2)
 */
const isStudent = (req, res, next) => {
    if (req.user && req.user.RoleId === 2) {
        next();
    } else {
        return res.status(403).json({ message: 'Quyền truy cập dành riêng cho Sinh viên' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isStudent
};
