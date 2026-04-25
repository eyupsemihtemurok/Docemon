/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('user', table => {
        table.string('kan_grubu', 10).nullable();
        table.text('kronik_hastaliklar').nullable();
        table.date('dogum_tarihi').nullable();
        table.string('telefon', 20).nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('user', table => {
        table.dropColumn('kan_grubu');
        table.dropColumn('kronik_hastaliklar');
        table.dropColumn('dogum_tarihi');
        table.dropColumn('telefon');
    });
};
