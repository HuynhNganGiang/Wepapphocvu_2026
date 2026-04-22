const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng và quản lý phiên đăng nhập.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     description: Xác thực người dùng bằng username và password. Nếu thành công, trả về mã Token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên người dùng để đăng nhập.
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu đính kèm với tài khoản.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, nhận token truy cập.
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
 *                   example: Đăng nhập thành công.
 *                 token:
 *                   type: string
 *                   description: Chuỗi token JWT (AccessToken).
 *       401:
 *         description: Sai thông tin đăng nhập.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Sai tài khoản hoặc mật khẩu.
 *       500:
 *         description: Lỗi máy chủ khi xử lý đăng nhập.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Đã xảy ra lỗi máy chủ trong quá trình đăng nhập.
 */
router.post('/login', authController.login);
/* url: localhost:3000/login */
module.exports = router;
