/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const ensureTable = async (tableName, builder) => {
        const exists = await knex.schema.hasTable(tableName);
        if (!exists) {
            await knex.schema.createTable(tableName, builder);
        }
    };

    // 1. USER TABLE
    await ensureTable('user', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.string('full_name', 100).notNullable();
        table.string('email', 100).unique().notNullable();
        table.string('password', 255).notNullable();
        table.string('blood_type', 10);
        table.text('chronic_diseases');
        table.date('birth_date');
        table.string('phone', 20);
        table.text('face_data');
        table.boolean('is_active').defaultTo(true);
        table.datetime('created_at', { precision: 2 }).defaultTo(knex.fn.now());
        table.datetime('updated_at', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 2. ROLE TABLE
    await ensureTable('role', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.string('name', 50).unique().notNullable();
    });

    // 3. USER_ROLE TABLE
    await ensureTable('user_role', (table) => {
        table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
        table.uuid('role_id').references('id').inTable('role').onDelete('CASCADE');
        table.primary(['user_id', 'role_id']);
    });

    // 4. DISASTER TABLE
    await ensureTable('disaster', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.string('type', 50).notNullable(); // Earthquake, Flood, etc.
        table.string('severity', 20);           // Magnitude or Scale
        table.string('location_name', 100);
        table.decimal('latitude', 10, 8);
        table.decimal('longitude', 11, 8);
        table.text('description');
        table.datetime('start_time', { precision: 2 }).defaultTo(knex.fn.now());
        table.datetime('end_time', { precision: 2 });
        table.boolean('is_active').defaultTo(true);
    });

    // 5. LOCATION TABLE
    await ensureTable('location', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
        table.decimal('latitude', 10, 8);
        table.decimal('longitude', 11, 8);
        table.string('city', 50);
        table.datetime('created_at', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 6. AUDIT_LOG TABLE
    await ensureTable('audit_log', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('user_id').references('id').inTable('user').onDelete('SET NULL');
        table.string('event_type', 100).notNullable();
        table.text('details');
        table.datetime('created_at', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 7. NOTIFICATION TABLE
    await ensureTable('notification', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE');
        table.string('title', 100).notNullable();
        table.string('message', 500).notNullable();
        table.string('type', 50).notNullable();
        table.boolean('is_read').defaultTo(false);
        table.datetime('created_at', { precision: 2 }).defaultTo(knex.fn.now());
    });

    // 8. FRIEND TABLE
    await ensureTable('friend', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('NEWID()'));
        table.uuid('sender_id').references('id').inTable('user').onDelete('NO ACTION');
        table.uuid('receiver_id').references('id').inTable('user').onDelete('NO ACTION');
        table.string('status', 20).defaultTo('PENDING');
        table.datetime('created_at', { precision: 2 }).defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('friend');
    await knex.schema.dropTableIfExists('notification');
    await knex.schema.dropTableIfExists('audit_log');
    await knex.schema.dropTableIfExists('location');
    await knex.schema.dropTableIfExists('disaster');
    await knex.schema.dropTableIfExists('user_role');
    await knex.schema.dropTableIfExists('role');
    await knex.schema.dropTableIfExists('user');
};


