/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // 1. USER TABLOSU
    await knex.schema.createTable('user', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.string('tc', 64).unique().notNullable();
        table.string('ad_soyad', 100).notNullable();
        table.string('email', 100).unique().notNullable();
        table.string('sifre', 255).notNullable();
        table.text('yuz_verisi');
        table.boolean('aktiflik').defaultTo(true);
        table.datetime('kayit_tarihi', { precision: 2 }).defaultTo(knex.fn.now());
        table.datetime('guncelleme_tarihi', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 2. ROL TABLOSU
    await knex.schema.createTable('rol', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.string('ad', 50).unique().notNullable();
    });

    // 3. USER_ROL TABLOSU
    await knex.schema.createTable('user_rol', (table) => {
        table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
        table.uuid('rol_id').references('id').inTable('rol').onDelete('CASCADE');
        table.primary(['user_id', 'rol_id']);
    });

    // 4. KONUM TABLOSU
    await knex.schema.createTable('konum', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
        table.decimal('enlem', 10, 8);
        table.decimal('boylam', 11, 8);
        table.string('sehir', 50);
        table.datetime('tarih', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 5. LOG TABLOSU
    await knex.schema.createTable('log', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('user_id').references('id').inTable('user').onDelete('SET NULL');
        table.string('olay_tipi', 100).notNullable();
        table.text('detay');
        table.datetime('tarih', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 6. BİLDİRİM TABLOSU
    await knex.schema.createTable('bildirim', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
        table.string('baslik', 100).notNullable();
        table.string('mesaj', 500).notNullable();
        table.string('tip', 50).notNullable();
        table.boolean('okundu').defaultTo(false);
        table.datetime('tarih', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 7. ARKADAŞ TABLOSU
    await knex.schema.createTable('arkadas', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('istek_atan_id').references('id').inTable('user').onDelete('NO ACTION');
        table.uuid('istek_alan_id').references('id').inTable('user').onDelete('NO ACTION');
        table.string('durum', 20).defaultTo('BEKLIYOR');
        table.datetime('tarih', { precision: 2 }).defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('arkadas');
    await knex.schema.dropTableIfExists('bildirim');
    await knex.schema.dropTableIfExists('log');
    await knex.schema.dropTableIfExists('konum');
    await knex.schema.dropTableIfExists('user_rol');
    await knex.schema.dropTableIfExists('rol');
    await knex.schema.dropTableIfExists('user');
};

