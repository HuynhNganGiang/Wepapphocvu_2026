const { poolPromise, sql } = require('../config/db.config');

/**
 * Lấy tất cả danh sách môn học
 */
const getAllCourses = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('sp_GetAllCourses');
        res.json(result.recordset);
    } catch (error) {
        console.error('Lỗi getAllCourses:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách môn học', error: error.message });
    }
};

/**
 * Lấy môn học theo ID
 */
const getbyID = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CourseId', sql.Int, id)
            .execute('sp_GetCourseById');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy môn học' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Lỗi getbyID:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin môn học', error: error.message });
    }
};

/**
 * Tạo mới môn học
 */
const createCourse = async (req, res) => {
    try {
        const { CourseCode, CourseName, Credits, DepartmentId } = req.body;

        // Kiểm tra Credits từ 1 đến 10
        if (Credits < 1 || Credits > 10) {
            return res.status(400).json({ message: 'Số tín chỉ (Credits) phải nằm trong khoảng từ 1 đến 10' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('CourseCode', sql.NVarChar, CourseCode)
            .input('CourseName', sql.NVarChar, CourseName)
            .input('Credits', sql.Int, Credits)
            .input('DepartmentId', sql.Int, DepartmentId)
            .execute('sp_CreateCourse');

        res.status(201).json({ message: 'Thêm môn học thành công' });
    } catch (error) {
        console.error('Lỗi createCourse:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi thêm môn học', error: error.message });
    }
};

/**
 * Cập nhật môn học dựa trên ID
 */
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { CourseCode, CourseName, Credits, DepartmentId } = req.body;

        // Kiểm tra Credits từ 1 đến 10 nếu có cập nhật Credits
        if (Credits !== undefined && (Credits < 1 || Credits > 10)) {
            return res.status(400).json({ message: 'Số tín chỉ (Credits) phải nằm trong khoảng từ 1 đến 10' });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('CourseId', sql.Int, id)
            .input('CourseCode', sql.NVarChar, CourseCode)
            .input('CourseName', sql.NVarChar, CourseName)
            .input('Credits', sql.Int, Credits)
            .input('DepartmentId', sql.Int, DepartmentId)
            .execute('sp_UpdateCourse');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy môn học để cập nhật' });
        }

        res.json({ message: 'Cập nhật môn học thành công' });
    } catch (error) {
        console.error('Lỗi updateCourse:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật môn học', error: error.message });
    }
};

/**
 * Xóa môn học dựa trên ID
 */
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CourseId', sql.Int, id)
            .execute('sp_DeleteCourse');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy môn học để xóa' });
        }

        res.json({ message: 'Xóa môn học thành công' });
    } catch (error) {
        console.error('Lỗi deleteCourse:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa môn học', error: error.message });
    }
};

module.exports = {
    getAllCourses,
    getbyID,
    createCourse,
    updateCourse,
    deleteCourse
};
