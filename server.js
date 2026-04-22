// ==========================================
// 1. IMPORT CÁC THƯ VIỆN CẦN THIẾT
// ==========================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Nạp các biến môi trường từ file .env
dotenv.config();

// Kết nối Database
require('./config/db.config');

// Khởi tạo ứng dụng Express
const app = express();

// ==========================================
// 2. CẤU HÌNH MIDDLEWARES TOÀN CỤC
// ==========================================
// Cho phép các domain khác (như Frontend Vue/React) gọi API
app.use(cors());

// Giúp Express đọc được dữ liệu JSON gửi từ Request Body
app.use(express.json());

// Giúp phân tích dữ liệu dạng urlencoded (khi gửi form raw)
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 3. CẤU HÌNH SWAGGER (TÀI LIỆU API)
// ==========================================
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Quản lý Học vụ',
            version: '1.0.0',
            description: 'Tài liệu API cho hệ thống quản lý học vụ NodeJS & SQL Server',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                // Cấu hình để Swagger có chỗ nhập token JWT
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    // Nơi Swagger sẽ đọc các comment (để sinh ra UI), trỏ vào các file trong thư mục routes
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Tạo route /api-docs để truy cập giao diện Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==========================================
// 4. ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN (ROUTES) CƠ BẢN
// ==========================================
// Route kiểm tra server đang chạy
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với API Quản lý Học vụ!' });
});

/* 
 * Phần này sau này bạn sẽ Mount các route thực tế vào. 
 * Ví dụ:
 * const authRoutes = require('./routes/authRoutes');
 * app.use('/api/auth', authRoutes);
 */

// ==========================================
// 5. KHỞI ĐỘNG SERVER
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📚 Tài liệu Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`=========================================`);
});
