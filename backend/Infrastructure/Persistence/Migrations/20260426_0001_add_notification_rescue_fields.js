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
            table.uuid('related_user_id').nullable();
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

        // Guard existing inconsistent data before adding FK.
        await knex.raw(`
                UPDATE n
                SET related_user_id = NULL
                FROM [notification] n
                WHERE n.related_user_id IS NOT NULL
                    AND NOT EXISTS (
                        SELECT 1 FROM [user] u WHERE u.id = n.related_user_id
                    )
        `);

        // Add FK only once (important for repeated migrate:latest runs / partial failures).
        await knex.raw(`
                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.foreign_keys
                    WHERE name = 'notification_related_user_id_foreign'
                        AND parent_object_id = OBJECT_ID(N'[notification]')
                )
                BEGIN
                    ALTER TABLE [notification]
                    ADD CONSTRAINT [notification_related_user_id_foreign]
                    FOREIGN KEY ([related_user_id]) REFERENCES [user]([id])
                    ON DELETE SET NULL;
                END
        `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.raw(`
        IF EXISTS (
          SELECT 1
          FROM sys.foreign_keys
          WHERE name = 'notification_related_user_id_foreign'
            AND parent_object_id = OBJECT_ID(N'[notification]')
        )
        BEGIN
          ALTER TABLE [notification]
          DROP CONSTRAINT [notification_related_user_id_foreign];
        END
    `);

    const hasRelatedUserId = await knex.schema.hasColumn('notification', 'related_user_id');
    const hasHealthStatus = await knex.schema.hasColumn('notification', 'health_status');
    const hasAssemblyPoint = await knex.schema.hasColumn('notification', 'assembly_point');
    const hasLocationDetails = await knex.schema.hasColumn('notification', 'location_details');

    await knex.schema.alterTable('notification', (table) => {
        if (hasRelatedUserId) table.dropColumn('related_user_id');
        if (hasHealthStatus) table.dropColumn('health_status');
        if (hasAssemblyPoint) table.dropColumn('assembly_point');
        if (hasLocationDetails) table.dropColumn('location_details');
    });
};
