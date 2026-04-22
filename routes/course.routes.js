const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API quản lý môn học (Courses)
 */

/**
 * @swagger
 * /api/course:
 *   get:
 *     summary: Lấy danh sách tất cả môn học
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Danh sách môn học
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /api/course/{id}:
 *   get:
 *     summary: Lấy thông tin môn học theo ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của môn học
 *     responses:
 *       200:
 *         description: Thông tin chi tiết môn học
 *       404:
 *         description: Không tìm thấy môn học
 */
router.get('/:id', courseController.getbyID);

/**
 * @swagger
 * /api/course:
 *   post:
 *     summary: Tạo mới một môn học (Yêu cầu Admin)
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CourseCode
 *               - CourseName
 *               - Credits
 *               - DepartmentId
 *             properties:
 *               CourseCode:
 *                 type: string
 *                 example: "IT101"
 *               CourseName:
 *                 type: string
 *                 example: "Lập trình C cơ bản"
 *               Credits:
 *                 type: integer
 *                 example: 3
 *               DepartmentId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Thêm môn học thành công
 *       400:
 *         description: Dữ liệu không hợp lệ (ví dụ Credits ngoài khoảng 1-10)
 *       403:
 *         description: Không có quyền truy cập (không phải Admin)
 */
router.post('/', verifyToken, isAdmin, courseController.createCourse);

/**
 * @swagger
 * /api/course/{id}:
 *   put:
 *     summary: Cập nhật thông tin môn học (Yêu cầu Admin)
 *     tags: [Courses]
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
 *               CourseCode:
 *                 type: string
 *               CourseName:
 *                 type: string
 *               Credits:
 *                 type: integer
 *               DepartmentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy môn học
 *       403:
 *         description: Không có quyền truy cập
 */
router.put('/:id', verifyToken, isAdmin, courseController.updateCourse);

/**
 * @swagger
 * /api/course/{id}:
 *   delete:
 *     summary: Xóa môn học (Yêu cầu Admin)
 *     tags: [Courses]
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
 *         description: Không tìm thấy môn học
 *       403:
 *         description: Không có quyền truy cập
 */
router.delete('/:id', verifyToken, isAdmin, courseController.deleteCourse);

module.exports = router;
