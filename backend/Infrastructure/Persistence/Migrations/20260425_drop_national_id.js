/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const hasColumn = await knex.schema.hasColumn('user', 'national_id');
    if (!hasColumn) return;

    // MSSQL may keep unique indexes/constraints attached to this column.
    await knex.raw(`
        DECLARE @sql NVARCHAR(MAX) = N'';

        SELECT @sql += N'ALTER TABLE [user] DROP CONSTRAINT [' + dc.name + N'];'
        FROM sys.default_constraints dc
        JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
        WHERE dc.parent_object_id = OBJECT_ID(N'[user]') AND c.name = N'national_id';

        SELECT @sql += N'ALTER TABLE [user] DROP CONSTRAINT [' + kc.name + N'];'
        FROM sys.key_constraints kc
        JOIN sys.index_columns ic ON kc.parent_object_id = ic.object_id AND kc.unique_index_id = ic.index_id
        JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
        WHERE kc.parent_object_id = OBJECT_ID(N'[user]') AND c.name = N'national_id';

        SELECT @sql += N'DROP INDEX [' + i.name + N'] ON [user];'
        FROM sys.indexes i
        JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
        WHERE i.object_id = OBJECT_ID(N'[user]')
          AND c.name = N'national_id'
          AND i.is_primary_key = 0
          AND i.is_hypothetical = 0
          AND i.name IS NOT NULL;

        IF (@sql <> N'') EXEC sp_executesql @sql;
    `);

    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('national_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    const hasColumn = await knex.schema.hasColumn('user', 'national_id');
    if (hasColumn) return;

    await knex.schema.alterTable('user', (table) => {
        table.string('national_id', 64).nullable().unique();
    });
};
