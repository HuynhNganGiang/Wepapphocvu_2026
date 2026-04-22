const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, isStudent } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: API quản lý đăng ký học phần
 */

/**
 * @swagger
 * /api/enrollment:
 *   post:
 *     summary: Đăng ký học phần (Dành cho Sinh viên)
 *     tags: [Enrollments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ClassId
 *             properties:
 *               ClassId:
 *                 type: integer
 *                 description: ID của lớp học muốn đăng ký
 *                 example: 1
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đăng ký học phần thành công"
 *       400:
 *         description: Lỗi logic (Lớp đầy, đã đăng ký, hoặc lớp đóng)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lớp đã đủ sĩ số"
 *       401:
 *         description: Chưa xác thực (Token không hợp lệ hoặc thiếu)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token không hợp lệ hoặc đã hết hạn."
 *       403:
 *         description: Không có quyền (Yêu cầu quyền Sinh viên)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quyền truy cập dành riêng cho Sinh viên"
 */
router.post('/', verifyToken, isStudent, enrollmentController.enrollClass);

module.exports = router;
