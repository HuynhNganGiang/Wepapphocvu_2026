const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API quản lý vai trò (Roles)
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Lấy danh sách tất cả vai trò
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Danh sách vai trò
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   RoleId:
 *                     type: integer
 *                   RoleName:
 *                     type: string
 */
router.get('/', roleController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Lấy thông tin vai trò theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Thông tin chi tiết vai trò
 *       404:
 *         description: Không tìm thấy vai trò
 */
router.get('/:id', roleController.getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Tạo mới một vai trò (Yêu cầu Admin)
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - RoleName
 *             properties:
 *               RoleName:
 *                 type: string
 *                 example: "Editor"
 *     responses:
 *       201:
 *         description: Thêm vai trò thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       403:
 *         description: Không có quyền truy cập
 */
router.post('/', verifyToken, isAdmin, roleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Cập nhật thông tin vai trò (Yêu cầu Admin)
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RoleName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy vai trò
 *       403:
 *         description: Không có quyền truy cập
 */
router.put('/:id', verifyToken, isAdmin, roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Xóa vai trò (Yêu cầu Admin)
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy vai trò
 *       403:
 *         description: Không có quyền truy cập
 */
router.delete('/:id', verifyToken, isAdmin, roleController.deleteRole);

module.exports = router;
