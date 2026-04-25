/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('province', (table) => {
            table.integer('id').primary(); // Plate code
            table.string('name').notNullable();
        })
        .createTable('district', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.integer('province_id').unsigned().notNullable();
            table.foreign('province_id').references('province.id').onDelete('CASCADE');
        })
        .alterTable('user', (table) => {
            // Update user table to link to geography
            table.integer('province_id').unsigned().nullable();
            table.integer('district_id').unsigned().nullable();
            // We'll keep the string fields too for flexibility but these IDs are better
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .alterTable('user', (table) => {
            table.dropColumn('province_id');
            table.dropColumn('district_id');
        })
        .dropTableIfExists('district')
        .dropTableIfExists('province');
};
