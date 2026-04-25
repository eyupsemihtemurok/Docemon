/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const hasColumn = await knex.schema.hasColumn('user', 'national_id');
    if (hasColumn) {
        return;
    }

    await knex.schema.alterTable('user', (table) => {
        table.string('national_id', 64).nullable().unique();
    });

    const rows = await knex('user').select('id');
    for (const row of rows) {
        await knex('user')
            .where({ id: row.id })
            .update({ national_id: `legacy_${row.id}` });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    const hasColumn = await knex.schema.hasColumn('user', 'national_id');
    if (!hasColumn) {
        return;
    }

    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('national_id');
    });
};
