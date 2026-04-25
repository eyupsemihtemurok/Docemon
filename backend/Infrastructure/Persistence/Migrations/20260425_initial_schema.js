/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        -- 1. USER TABLOSU
        CREATE TABLE [user] (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(), 
            tc NVARCHAR(64) UNIQUE NOT NULL,     
            ad_soyad NVARCHAR(100) NOT NULL,
            email NVARCHAR(100) UNIQUE NOT NULL,
            sifre NVARCHAR(255) NOT NULL,
            yuz_verisi NVARCHAR(MAX),
            aktiflik BIT DEFAULT 1, 
            kayit_tarihi DATETIME2 DEFAULT GETUTCDATE(),        
            guncelleme_tarihi DATETIME2 DEFAULT GETUTCDATE()         
        );
    `);

    await knex.raw(`
        -- 2. ROL TABLOSU
        CREATE TABLE rol (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            ad NVARCHAR(50) UNIQUE NOT NULL
        );
    `);

    await knex.raw(`
        -- 3. USER_ROL TABLOSU
        CREATE TABLE user_rol (
            user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [user](id),
            rol_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES rol(id),
            PRIMARY KEY (user_id, rol_id) 
        );
    `);

    await knex.raw(`
        -- 4. KONUM TABLOSU
        CREATE TABLE konum (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [user](id), 
            enlem DECIMAL(10, 8),                         
            boylam DECIMAL(11, 8),                        
            sehir NVARCHAR(50),                               
            tarih DATETIME2 DEFAULT GETUTCDATE()
        );
    `);

    await knex.raw(`
        -- 5. LOG TABLOSU
        CREATE TABLE log (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [user](id), 
            olay_tipi NVARCHAR(100) NOT NULL,                         
            detay NVARCHAR(MAX),                              
            tarih DATETIME2 DEFAULT GETUTCDATE()
        );
    `);

    await knex.raw(`
        -- 6. BİLDİRİM TABLOSU
        CREATE TABLE bildirim (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [user](id), 
            baslik NVARCHAR(100) NOT NULL,                             
            mesaj NVARCHAR(500) NOT NULL,                           
            tip NVARCHAR(50) NOT NULL,                              
            okundu BIT DEFAULT 0,                                     
            tarih DATETIME2 DEFAULT GETUTCDATE()
        );
    `);

    await knex.raw(`
        -- 7. ARKADAŞ TABLOSU
        CREATE TABLE arkadas (
            id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            istek_atan_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [user](id), 
            istek_alan_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [user](id), 
            durum NVARCHAR(20) DEFAULT 'BEKLIYOR',                         
            tarih DATETIME2 DEFAULT GETUTCDATE()
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw('DROP TABLE IF EXISTS arkadas');
    await knex.raw('DROP TABLE IF EXISTS bildirim');
    await knex.raw('DROP TABLE IF EXISTS log');
    await knex.raw('DROP TABLE IF EXISTS konum');
    await knex.raw('DROP TABLE IF EXISTS user_rol');
    await knex.raw('DROP TABLE IF EXISTS rol');
    await knex.raw('DROP TABLE IF EXISTS [user]');
};
