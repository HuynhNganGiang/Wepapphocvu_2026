const sql = require('mssql');
const bcrypt = require('bcryptjs');
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

async function initAdmin() {
    try {
        console.log('--- 🚀 Đang khởi tạo tài khoản Admin... ---');
        
        let pool = await sql.connect(config);
        
        const username = 'admin';
        const password = 'admin123'; // Mật khẩu mặc định
        const fullName = 'System Administrator';
        const email = 'admin@example.com';
        const roleId = 1; // Admin RoleId đã xác nhận là 1
        const isActive = 1;

        // 1. Kiểm tra xem user đã tồn tại chưa
        const checkUser = await pool.request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT UserId FROM Users WHERE Username = @Username');

        if (checkUser.recordset.length > 0) {
            console.log(`⚠️ Tài khoản "${username}" đã tồn tại. Đang thực hiện cập nhật mật khẩu...`);
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await pool.request()
                .input('Username', sql.NVarChar, username)
                .input('PasswordHash', sql.NVarChar, hashedPassword)
                .query('UPDATE Users SET PasswordHash = @PasswordHash WHERE Username = @Username');
            
            console.log('✅ Cập nhật mật khẩu Admin thành công!');
        } else {
            console.log(`📝 Đang tạo tài khoản "${username}" mới...`);
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await pool.request()
                .input('Username', sql.NVarChar, username)
                .input('PasswordHash', sql.NVarChar, hashedPassword)
                .input('FullName', sql.NVarChar, fullName)
                .input('Email', sql.NVarChar, email)
                .input('RoleId', sql.Int, roleId)
                .input('IsActive', sql.Bit, isActive)
                .query(`
                    INSERT INTO Users (Username, PasswordHash, FullName, Email, RoleId, IsActive)
                    VALUES (@Username, @PasswordHash, @FullName, @Email, @RoleId, @IsActive)
                `);
            
            console.log('✅ Khởi tạo tài khoản Admin thành công!');
        }

        console.log('------------------------------------------');
        console.log(`Tài khoản: ${username}`);
        console.log(`Mật khẩu: ${password}`);
        console.log('Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.');
        console.log('------------------------------------------');

        process.exit(0);
    } catch (err) {
        console.error('❌ LỖI KHỞI TẠO ADMIN:');
        console.error(err.message);
        process.exit(1);
    }
}

initAdmin();
