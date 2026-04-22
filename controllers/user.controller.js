const { poolPromise, sql } = require('../config/db.config');
const bcrypt = require('bcryptjs');

/**
 * Lấy tất cả danh sách người dùng
 */
const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('sp_GetAllUsers');
        res.json(result.recordset);
    } catch (error) {
        console.error('Lỗi getAllUsers:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách người dùng', error: error.message });
    }
};

/**
 * Lấy thông tin người dùng theo ID
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, id)
            .execute('sp_GetUserById');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Lỗi getUserById:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin người dùng', error: error.message });
    }
};

/**
 * Tạo mới người dùng
 * Yêu cầu: verifyToken, isAdmin
 */
const createUser = async (req, res) => {
    try {
        const { Username, Password, FullName, Email, RoleId, IsActive } = req.body;

        if (!Username || !Password) {
            return res.status(400).json({ message: 'Username và Password là bắt buộc' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(Password, salt);

        const pool = await poolPromise;
        await pool.request()
            .input('Username', sql.NVarChar, Username)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .input('FullName', sql.NVarChar, FullName)
            .input('Email', sql.NVarChar, Email)
            .input('RoleId', sql.Int, RoleId || 2) // Mặc định là Student (2) nếu không truyền
            .input('IsActive', sql.Bit, IsActive !== undefined ? IsActive : 1)
            .execute('sp_CreateUser');

        res.status(201).json({ message: 'Thêm người dùng thành công' });
    } catch (error) {
        console.error('Lỗi createUser:', error.message);
        if (error.message.includes('UNIQUE CONSTRAINT')) {
            return res.status(400).json({ message: 'Username hoặc Email đã tồn tại' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi thêm người dùng', error: error.message });
    }
};

/**
 * Cập nhật thông tin người dùng
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { FullName, Email, RoleId, IsActive, Password } = req.body;

        let passwordHash = null;
        if (Password) {
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(Password, salt);
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, id)
            .input('FullName', sql.NVarChar, FullName)
            .input('Email', sql.NVarChar, Email)
            .input('RoleId', sql.Int, RoleId)
            .input('IsActive', sql.Bit, IsActive)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .execute('sp_UpdateUser');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật' });
        }

        res.json({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        console.error('Lỗi updateUser:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật người dùng', error: error.message });
    }
};

/**
 * Reset mật khẩu về mặc định: username_123
 */
const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        // 1. Lấy thông tin user để lấy Username
        const userResult = await pool.request()
            .input('UserId', sql.Int, id)
            .execute('sp_GetUserById');

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const user = userResult.recordset[0];
        const defaultPassword = `${user.Username}_123`;

        // 2. Mã hóa mật khẩu mặc định
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(defaultPassword, salt);

        // 3. Cập nhật vào DB
        await pool.request()
            .input('UserId', sql.Int, id)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .execute('sp_UpdatePassword');

        res.json({ 
            message: `Reset mật khẩu thành công cho người dùng ${user.Username}`,
            newPasswordDefault: defaultPassword 
        });
    } catch (error) {
        console.error('Lỗi resetPassword:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi reset mật khẩu', error: error.message });
    }
};

/**
 * Xóa người dùng
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, id)
            .execute('sp_DeleteUser');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
        }

        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        console.error('Lỗi deleteUser:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa người dùng', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    resetPassword,
    deleteUser
};
