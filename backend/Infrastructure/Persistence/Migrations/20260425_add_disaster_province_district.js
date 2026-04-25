/**
 * Migration: Add province_id to disaster table + create disaster_district junction table
 * Idempotent: checks existence before altering.
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
    // 1. Add province_id to disaster only if it doesn't exist yet
    const hasProvinceId = await knex.schema.hasColumn('disaster', 'province_id');
    if (!hasProvinceId) {
        await knex.schema.alterTable('disaster', (table) => {
            table.integer('province_id').unsigned().nullable();
            table.foreign('province_id').references('province.id').onDelete('SET NULL');
        });
    }

    // 2. Create disaster_district junction table only if it doesn't exist
    const hasJunctionTable = await knex.schema.hasTable('disaster_district');
    if (!hasJunctionTable) {
        await knex.schema.createTable('disaster_district', (table) => {
            table.uuid('disaster_id').references('id').inTable('disaster').onDelete('CASCADE');
            table.integer('district_id').unsigned().references('id').inTable('district').onDelete('CASCADE');
            table.primary(['disaster_id', 'district_id']);
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('disaster_district');

    const hasProvinceId = await knex.schema.hasColumn('disaster', 'province_id');
    if (hasProvinceId) {
        await knex.schema.alterTable('disaster', (table) => {
            table.dropForeign(['province_id']);
            table.dropColumn('province_id');
        });
    }
};
