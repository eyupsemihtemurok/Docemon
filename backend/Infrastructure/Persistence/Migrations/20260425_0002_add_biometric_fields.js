/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const hasUser = await knex.schema.hasTable('user');

    if (hasUser) {
        const hasFaceEmbedding = await knex.schema.hasColumn('user', 'face_embedding');
        if (!hasFaceEmbedding) {
            await knex.schema.alterTable('user', (table) => {
                table.text('face_embedding').nullable();
            });
        }
    }

    const hasVerificationAlert = await knex.schema.hasTable('verification_alert');
    if (!hasVerificationAlert && hasUser) {
        await knex.schema.createTable('verification_alert', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
            table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
            table.string('image_id', 255);
            table.float('matching_score');
            table.string('status', 20).defaultTo('PENDING');
            table.text('health_details');
            table.text('location_details');
            table.datetime('created_at').defaultTo(knex.fn.now());
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('verification_alert');

    const hasUser = await knex.schema.hasTable('user');
    if (hasUser) {
        const hasFaceEmbedding = await knex.schema.hasColumn('user', 'face_embedding');
        if (hasFaceEmbedding) {
            await knex.schema.alterTable('user', (table) => {
                table.dropColumn('face_embedding');
            });
        }
    }
};
