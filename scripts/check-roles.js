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

async function checkAndCreateRoles() {
    try {
        let pool = await sql.connect(config);
        console.log('--- 🔍 Checking for Roles table ---');
        
        const checkTableResult = await pool.request().query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Roles'");
        
        if (checkTableResult.recordset.length > 0) {
            console.log('✅ Table "Roles" already exists.');
            const columnsResult = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Roles'");
            console.log('--- 📋 Columns in Roles table ---');
            columnsResult.recordset.forEach(col => {
                console.log(`- ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
            });
        } else {
            console.log('📝 Table "Roles" does not exist. Creating it...');
            await pool.request().query(`
                CREATE TABLE Roles (
                    RoleId INT PRIMARY KEY IDENTITY(1,1),
                    RoleName NVARCHAR(50) NOT NULL UNIQUE
                );
                
                INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Student'), ('Teacher');
            `);
            console.log('✅ Table "Roles" created successfully with initial data.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ LỖI:');
        console.error(err.message);
        process.exit(1);
    }
}

checkAndCreateRoles();
