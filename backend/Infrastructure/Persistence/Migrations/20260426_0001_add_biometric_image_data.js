/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  const hasRescueImage = await knex.schema.hasColumn('verification_alert', 'rescue_image_base64');
  if (!hasRescueImage) {
    await knex.schema.alterTable('verification_alert', (table) => {
      table.text('rescue_image_base64');
      table.string('rescue_image_mime', 100);
    });
  }

  const hasFaceMime = await knex.schema.hasColumn('user', 'face_mime_type');
  if (!hasFaceMime) {
    await knex.schema.alterTable('user', (table) => {
      table.string('face_mime_type', 100);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  const hasRescueImage = await knex.schema.hasColumn('verification_alert', 'rescue_image_base64');
  if (hasRescueImage) {
    await knex.schema.alterTable('verification_alert', (table) => {
      table.dropColumn('rescue_image_base64');
      table.dropColumn('rescue_image_mime');
    });
  }

  const hasFaceMime = await knex.schema.hasColumn('user', 'face_mime_type');
  if (hasFaceMime) {
    await knex.schema.alterTable('user', (table) => {
      table.dropColumn('face_mime_type');
    });
  }
};
