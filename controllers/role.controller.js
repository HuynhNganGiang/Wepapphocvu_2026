const { poolPromise, sql } = require('../config/db.config');

/**
 * Lấy tất cả danh sách vai trò
 */
const getAllRoles = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Roles');
        res.json(result.recordset);
    } catch (error) {
        console.error('Lỗi getAllRoles:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách vai trò', error: error.message });
    }
};

/**
 * Lấy vai trò theo ID
 */
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RoleId', sql.Int, id)
            .query('SELECT * FROM Roles WHERE RoleId = @RoleId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy vai trò' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Lỗi getRoleById:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin vai trò', error: error.message });
    }
};

/**
 * Tạo mới vai trò
 * Yêu cầu: verifyToken, isAdmin
 */
const createRole = async (req, res) => {
    try {
        const { RoleName } = req.body;

        if (!RoleName) {
            return res.status(400).json({ message: 'Tên vai trò (RoleName) là bắt buộc' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('RoleName', sql.NVarChar, RoleName)
            .query('INSERT INTO Roles (RoleName) VALUES (@RoleName)');

        res.status(201).json({ message: 'Thêm vai trò thành công' });
    } catch (error) {
        console.error('Lỗi createRole:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi thêm vai trò', error: error.message });
    }
};

/**
 * Cập nhật vai trò dựa trên ID
 * Yêu cầu: verifyToken, isAdmin
 */
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { RoleName } = req.body;

        if (!RoleName) {
            return res.status(400).json({ message: 'Tên vai trò (RoleName) là bắt buộc' });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('RoleId', sql.Int, id)
            .input('RoleName', sql.NVarChar, RoleName)
            .query('UPDATE Roles SET RoleName = @RoleName WHERE RoleId = @RoleId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy vai trò để cập nhật' });
        }

        res.json({ message: 'Cập nhật vai trò thành công' });
    } catch (error) {
        console.error('Lỗi updateRole:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật vai trò', error: error.message });
    }
};

/**
 * Xóa vai trò dựa trên ID
 * Yêu cầu: verifyToken, isAdmin
 */
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RoleId', sql.Int, id)
            .query('DELETE FROM Roles WHERE RoleId = @RoleId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy vai trò để xóa' });
        }

        res.json({ message: 'Xóa vai trò thành công' });
    } catch (error) {
        console.error('Lỗi deleteRole:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa vai trò', error: error.message });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
