const fs = require('fs');
const path = require('path');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Temiz başlangıç — bağımlılık sırasına dikkat
  await knex.raw('DELETE FROM disaster_district');
  await knex.raw('DELETE FROM district');
  await knex.raw('DELETE FROM province');
  // district has an identity column, province does not
  try { await knex.raw("DBCC CHECKIDENT ('district', RESEED, 0)"); } catch (_) { /* ignore if not identity */ }

  const geoDataPath = path.join(__dirname, 'data', 'turkey_geo.json');
  const geoData = JSON.parse(fs.readFileSync(geoDataPath, 'utf8'));

  for (const item of geoData) {
    // 1. Insert Province
    await knex('province').insert({
      id: item.id,
      name: item.name
    });

    // 2. Prepare Districts
    const districtsToInsert = item.districts.map(districtName => ({
      name: districtName,
      province_id: item.id
    }));

    // 3. Batch Insert Districts
    if (districtsToInsert.length > 0) {
      await knex('district').insert(districtsToInsert);
    }
  }
};
