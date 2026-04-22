const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// 1. Nạp các biến môi trường từ file .env
dotenv.config();

// 2. Kết nối Database (Nạp file config để thực thi kết nối)
require('./config/db.config');

const app = express();
const PORT = process.env.PORT || 3000;

// 3. Cấu hình Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Cấu hình Swagger Documentation
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Học Vụ API Documentation',
            version: '1.0.0',
            description: 'Tài liệu API cho hệ thống Web App Học Vụ 2026. Hỗ trợ quản lý sinh viên, học phần và điểm.',
            contact: {
                name: 'Đội ngũ phát triển 2026'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development Server'
            }
        ],
        // Cấu hình bảo mật JWT (Bearer Token) cho Swagger
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Nhập token JWT vào đây theo định dạng: Bearer {token}'
                }
            }
        },
        // Áp dụng bảo mật JWT mặc định cho tất cả các API
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    // Đường dẫn trỏ tới các file Route để Swagger tự động quét doc
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const roleRoutes = require('./routes/role.routes');
const userRoutes = require('./routes/user.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');

// 5. Khai báo các Routes
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollment', enrollmentRoutes);

// 6. Định nghĩa API kiểm tra server (Health Check)
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Kiểm tra trạng thái hoạt động của Server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 message:
 *                   type: string
 *                   example: Server is running smoothly
 *                 timestamp:
 *                   type: string
 *                   example: "2026-04-08T14:35:00.000Z"
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is running smoothly',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// 6. Khởi động Server
app.listen(PORT, () => {
    console.log(`\n================================================`);
    console.log(`🚀 Web App Học Vụ 2026 is LIVE!`);
    console.log(`🔗 Local server: http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`================================================\n`);
});
