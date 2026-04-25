/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const hasUser = await knex.schema.hasTable('user');
    if (hasUser) {
        const hasSafetyStatus = await knex.schema.hasColumn('user', 'safety_status');
        if (!hasSafetyStatus) {
            await knex.schema.alterTable('user', (table) => {
                table.string('safety_status', 20).defaultTo('SAFE');
            });
        }
    }

    const hasFriend = await knex.schema.hasTable('friend');
    if (hasFriend) {
        const hasEmergencyContact = await knex.schema.hasColumn('friend', 'is_emergency_contact');
        if (!hasEmergencyContact) {
            await knex.schema.alterTable('friend', (table) => {
                table.boolean('is_emergency_contact').defaultTo(false);
            });
        }
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    const hasFriend = await knex.schema.hasTable('friend');
    if (hasFriend) {
        const hasEmergencyContact = await knex.schema.hasColumn('friend', 'is_emergency_contact');
        if (hasEmergencyContact) {
            await knex.schema.alterTable('friend', (table) => {
                table.dropColumn('is_emergency_contact');
            });
        }
    }

    const hasUser = await knex.schema.hasTable('user');
    if (hasUser) {
        const hasSafetyStatus = await knex.schema.hasColumn('user', 'safety_status');
        if (hasSafetyStatus) {
            await knex.schema.alterTable('user', (table) => {
                table.dropColumn('safety_status');
            });
        }
    }
};
