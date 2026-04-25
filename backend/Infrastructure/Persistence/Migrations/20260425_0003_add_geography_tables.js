/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const hasProvince = await knex.schema.hasTable('province');
    if (!hasProvince) {
        await knex.schema.createTable('province', (table) => {
            table.integer('id').primary();
            table.string('name').notNullable();
        });
    }

    const hasDistrict = await knex.schema.hasTable('district');
    if (!hasDistrict) {
        await knex.schema.createTable('district', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.integer('province_id').unsigned().notNullable();
            table.foreign('province_id').references('province.id').onDelete('CASCADE');
        });
    }

    const hasUser = await knex.schema.hasTable('user');
    if (hasUser) {
        const hasProvinceId = await knex.schema.hasColumn('user', 'province_id');
        const hasDistrictId = await knex.schema.hasColumn('user', 'district_id');

        if (!hasProvinceId || !hasDistrictId) {
            await knex.schema.alterTable('user', (table) => {
                if (!hasProvinceId) table.integer('province_id').unsigned().nullable();
                if (!hasDistrictId) table.integer('district_id').unsigned().nullable();
            });
        }
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    const hasUser = await knex.schema.hasTable('user');
    if (hasUser) {
        const hasProvinceId = await knex.schema.hasColumn('user', 'province_id');
        const hasDistrictId = await knex.schema.hasColumn('user', 'district_id');

        if (hasProvinceId || hasDistrictId) {
            await knex.schema.alterTable('user', (table) => {
                if (hasProvinceId) table.dropColumn('province_id');
                if (hasDistrictId) table.dropColumn('district_id');
            });
        }
    }

    await knex.schema.dropTableIfExists('district');
    await knex.schema.dropTableIfExists('province');
};
