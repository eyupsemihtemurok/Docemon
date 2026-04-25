/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const hasUser = await knex.schema.hasTable('user');
    const hasFriend = await knex.schema.hasTable('friend');

    if (hasUser) {
        const hasFaceEmbedding = await knex.schema.hasColumn('user', 'face_embedding');
        const hasSafetyStatus = await knex.schema.hasColumn('user', 'safety_status');
        const hasProvinceId = await knex.schema.hasColumn('user', 'province_id');
        const hasDistrictId = await knex.schema.hasColumn('user', 'district_id');

        if (!hasFaceEmbedding || !hasSafetyStatus || !hasProvinceId || !hasDistrictId) {
            await knex.schema.alterTable('user', (table) => {
                if (!hasFaceEmbedding) table.text('face_embedding').nullable();
                if (!hasSafetyStatus) table.string('safety_status', 20).defaultTo('SAFE');
                if (!hasProvinceId) table.integer('province_id').unsigned().nullable();
                if (!hasDistrictId) table.integer('district_id').unsigned().nullable();
            });
        }
    }

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

    await knex.schema.dropTableIfExists('verification_alert');

    const hasUser = await knex.schema.hasTable('user');
    if (hasUser) {
        const hasFaceEmbedding = await knex.schema.hasColumn('user', 'face_embedding');
        const hasSafetyStatus = await knex.schema.hasColumn('user', 'safety_status');
        const hasProvinceId = await knex.schema.hasColumn('user', 'province_id');
        const hasDistrictId = await knex.schema.hasColumn('user', 'district_id');

        if (hasFaceEmbedding || hasSafetyStatus || hasProvinceId || hasDistrictId) {
            await knex.schema.alterTable('user', (table) => {
                if (hasFaceEmbedding) table.dropColumn('face_embedding');
                if (hasSafetyStatus) table.dropColumn('safety_status');
                if (hasProvinceId) table.dropColumn('province_id');
                if (hasDistrictId) table.dropColumn('district_id');
            });
        }
    }

    await knex.schema.dropTableIfExists('district');
    await knex.schema.dropTableIfExists('province');
};