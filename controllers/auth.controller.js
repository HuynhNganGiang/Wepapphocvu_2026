const { sql, poolPromise } = require('../config/db.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Xử lý đăng nhập người dùng
 * @param {Object} req - Đối tượng request
 * @param {Object} res - Đối tượng response
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Kiểm tra đầu vào
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ tài khoản và mật khẩu.'
            });
        }

        // 2. Kết nối Database và tìm người dùng
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .execute('sp_GetUserByUsername');

        const user = result.recordset[0];

        // 3. Kiểm tra người dùng và mật khẩu
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Sai tài khoản hoặc mật khẩu.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Sai tài khoản hoặc mật khẩu.'
            });
        }

        // 4. Tạo JWT Token
        // Payload chứa UserId và RoleId theo yêu cầu
        const payload = {
            UserId: user.UserId,
            RoleId: user.RoleId
        };

        const secretKey = process.env.JWT_SECRET;
        const options = {
            expiresIn: '2h' // Thời gian hết hạn là 2 giờ
        };

        const token = jwt.sign(payload, secretKey, options);

        // 5. Trả về kết quả JSON
        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công.',
            token: token
        });

    } catch (error) {
        console.error('Auth Controller Login Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi máy chủ trong quá trình đăng nhập.',
            error: error.message
        });
    }
};

module.exports = {
    login
};
