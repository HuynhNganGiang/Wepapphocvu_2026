const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function testConnection() {
    console.log('--- Đang thử kết nối với các thông số: ---');
    console.log('Server:', config.server);
    console.log('User:', config.user);
    console.log('Database:', config.database);
    console.log('------------------------------------------');

    try {
        let pool = await sql.connect(config);
        console.log('✅ KẾT NỐI THÀNH CÔNG!');
        const result = await pool.request().query('SELECT name FROM sys.databases');
        console.log('Danh sách các database của bạn:', result.recordset.map(db => db.name).join(', '));
        process.exit(0);
    } catch (err) {
        console.error('❌ KẾT NỐI THẤT BẠI!');
        console.error('Mã lỗi:', err.code);
        console.error('Thông báo:', err.message);
        process.exit(1);
    }
}

testConnection();
