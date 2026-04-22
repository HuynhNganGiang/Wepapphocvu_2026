const sql = require('mssql');
const dotenv = require('dotenv');

// Nạp các biến môi trường
dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Tắt mã hóa cho localhost để tránh lỗi SSL/TLS protocol
        trustServerCertificate: true // Giữ true để tin tưởng chứng chỉ tự ký nếu có
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Khởi tạo Connection Pool
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Kết nối MS SQL Server thành công!');
        return pool;
    })
    .catch(err => {
        console.error('❌ Kết nối MS SQL Server thất bại!');
        console.error('Lỗi chi tiết:', err.message);
        process.exit(1); // Dừng ứng dụng nếu không kết nối được Database quan trọng
    });

module.exports = {
    sql,
    poolPromise
};
