const migration = require('./20260425_0002_add_biometric_fields');

exports.up = migration.up;
exports.down = migration.down;const migration = require('./20260425_0002_add_biometric_fields');

exports.up = migration.up;
exports.down = migration.down;/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // 1. User tablosuna face_embedding kolonu ekle
    await knex.schema.alterTable('user', (table) => {
        table.text('face_embedding').nullable(); // 512-d vektör JSON string olarak tutulacak
    });

    // 2. Verification Alert tablosu oluştur
    await knex.schema.createTable('verification_alert', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
        table.string('image_id', 255); // Fotoğraf referansı
        table.float('matching_score');
        table.string('status', 20).defaultTo('PENDING'); // PENDING, APPROVED, REJECTED
        table.text('health_details');
        table.text('location_details');
        table.datetime('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('verification_alert');
    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('face_embedding');
    });
};
