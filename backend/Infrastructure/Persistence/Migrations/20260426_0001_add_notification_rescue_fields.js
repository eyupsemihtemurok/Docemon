/**
 * Migration: Add rescue-specific fields to notification table
 * - related_user_id: The rescued person's user ID
 * - health_status:   Health condition at time of rescue
 * - assembly_point:  Assembly/gathering point name
 * - location_details: Free-text location description
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const hasRelatedUserId = await knex.schema.hasColumn('notification', 'related_user_id');
    const hasHealthStatus = await knex.schema.hasColumn('notification', 'health_status');
    const hasAssemblyPoint = await knex.schema.hasColumn('notification', 'assembly_point');
    const hasLocationDetails = await knex.schema.hasColumn('notification', 'location_details');

    await knex.schema.alterTable('notification', (table) => {
        if (!hasRelatedUserId) {
            table.uuid('related_user_id').nullable().references('id').inTable('user').onDelete('SET NULL');
        }
        if (!hasHealthStatus) {
            table.string('health_status', 100).nullable();
        }
        if (!hasAssemblyPoint) {
            table.string('assembly_point', 200).nullable();
        }
        if (!hasLocationDetails) {
            table.string('location_details', 300).nullable();
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('notification', (table) => {
        table.dropColumn('related_user_id');
        table.dropColumn('health_status');
        table.dropColumn('assembly_point');
        table.dropColumn('location_details');
    });
};
