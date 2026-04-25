/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // Add safety_status to user table
    await knex.schema.alterTable('user', (table) => {
        table.string('safety_status', 20).defaultTo('SAFE'); // SAFE, IN_DANGER, UNKNOWN
    });

    // Add is_emergency_contact to friend table
    await knex.schema.alterTable('friend', (table) => {
        table.boolean('is_emergency_contact').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('friend', (table) => {
        table.dropColumn('is_emergency_contact');
    });

    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('safety_status');
    });
};
