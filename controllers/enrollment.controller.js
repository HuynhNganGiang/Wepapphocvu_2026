const { poolPromise, sql } = require('../config/db.config');

/**
 * Đăng ký học phần cho sinh viên
 * Logic: Sử dụng Transaction để đảm bảo an toàn dữ liệu và tránh over-enrollment
 */
const enrollClass = async (req, res) => {
    const { ClassId } = req.body;
    const StudentId = req.user.UserId; // Lấy từ middleware verifyToken

    if (!ClassId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp ClassId' });
    }

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        // 1. Bắt đầu Transaction
        await transaction.begin();

        // Kiểm tra 1: Lớp (Classes) có tồn tại và Status là 'Open' không?
        const classRequest = new sql.Request(transaction);
        const classResult = await classRequest
            .input('ClassId', sql.Int, ClassId)
            .query('SELECT MaxStudents, Status FROM Classes WHERE ClassId = @ClassId');

        if (classResult.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Lớp học không tồn tại' });
        }

        const targetClass = classResult.recordset[0];
        if (targetClass.Status !== 'Open') {
            await transaction.rollback();
            return res.status(400).json({ message: 'Lớp học đã đóng, không thể đăng ký' });
        }

        // Kiểm tra 2: Kiểm tra sĩ số hiện tại
        const countRequest = new sql.Request(transaction);
        const countResult = await countRequest
            .input('ClassId', sql.Int, ClassId)
            .query('SELECT COUNT(*) AS CurrentCount FROM Enrollments WHERE ClassId = @ClassId');

        const currentCount = countResult.recordset[0].CurrentCount;
        if (currentCount >= targetClass.MaxStudents) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Lớp đã đủ sĩ số' });
        }

        // Kiểm tra 3: Sinh viên đã đăng ký lớp này chưa?
        const checkRequest = new sql.Request(transaction);
        const checkResult = await checkRequest
            .input('ClassId', sql.Int, ClassId)
            .input('StudentId', sql.UniqueIdentifier, StudentId)
            .query('SELECT * FROM Enrollments WHERE ClassId = @ClassId AND StudentId = @StudentId');

        if (checkResult.recordset.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Bạn đã đăng ký lớp học này rồi' });
        }

        // Thực thi: INSERT vào bảng Enrollments
        const insertRequest = new sql.Request(transaction);
        await insertRequest
            .input('ClassId', sql.Int, ClassId)
            .input('StudentId', sql.UniqueIdentifier, StudentId)
            .input('EnrollmentDate', sql.DateTime, new Date())
            .query('INSERT INTO Enrollments (ClassId, StudentId, EnrollmentDate) VALUES (@ClassId, @StudentId, @EnrollmentDate)');

        // COMMIT Transaction
        await transaction.commit();

        res.status(201).json({ 
            success: true,
            message: 'Đăng ký học phần thành công' 
        });

    } catch (error) {
        // Rollback nếu có lỗi xảy ra trong quá trình thực thi
        if (transaction._aborted === false) {
            await transaction.rollback();
        }
        console.error('Lỗi enrollClass:', error.message);
        res.status(500).json({ 
            message: 'Lỗi hệ thống khi đăng ký học phần', 
            error: error.message 
        });
    }
};

module.exports = {
    enrollClass
};
