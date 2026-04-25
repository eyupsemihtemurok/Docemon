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

const migrationNameMap = {
    '20260425_initial_schema.js': '20260425_0001_initial_schema.js',
    '20260425_add_biometric_fields.js': '20260425_0002_add_biometric_fields.js',
    '20260425_add_safety_and_emergency_fields.js': '20260425_0004_add_safety_and_emergency_fields.js'
};

function escapeSqlString(value) {
    return value.replace(/'/g, "''");
}

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

        // Legacy migration adlari yeni dosya adlarina gecince Knex "directory is corrupt" hatasi verir.
        const escapedDbName = dbName.replace(/]/g, ']]');
        const hasMigrationTableResult = await pool.request().query(`
            SELECT 1 AS has_table
            FROM [${escapedDbName}].sys.tables
            WHERE name = 'knex_migrations'
        `);

        if (hasMigrationTableResult.recordset.length > 0) {
            for (const [oldName, newName] of Object.entries(migrationNameMap)) {
                const oldEscaped = escapeSqlString(oldName);
                const newEscaped = escapeSqlString(newName);

                await pool.request().query(`
                    UPDATE [${escapedDbName}].[dbo].[knex_migrations]
                    SET [name] = '${newEscaped}'
                    WHERE [name] = '${oldEscaped}'
                      AND NOT EXISTS (
                        SELECT 1
                        FROM [${escapedDbName}].[dbo].[knex_migrations]
                        WHERE [name] = '${newEscaped}'
                      )
                `);
            }
        }
        
        await pool.close();
        console.log('Veritabanı hazırlığı tamamlandı.');
        process.exit(0);
    } catch (err) {
        console.error('Veritabanı oluşturulurken hata oluştu:', err);
        process.exit(1);
    }
}

initDb();
