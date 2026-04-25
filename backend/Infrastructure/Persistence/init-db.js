const mssql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function initDb() {
    const dbName = process.env.DB_NAME || 'hackathon26';
    
    try {
        console.log(`Veritabanı kontrol ediliyor: ${dbName}...`);
        let pool = await mssql.connect(config);
        
        // Veritabanı var mı kontrol et, yoksa oluştur
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${dbName}')
            BEGIN
                CREATE DATABASE ${dbName};
                PRINT 'Veritabanı oluşturuldu: ${dbName}';
            END
            ELSE
            BEGIN
                PRINT 'Veritabanı zaten mevcut.';
            END
        `);
        
        await pool.close();
        console.log('Veritabanı hazırlığı tamamlandı.');
        process.exit(0);
    } catch (err) {
        console.error('Veritabanı oluşturulurken hata oluştu:', err);
        process.exit(1);
    }
}

initDb();
