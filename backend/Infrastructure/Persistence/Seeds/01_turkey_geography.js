const fs = require('fs');
const path = require('path');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // MSSQL Agresif Sıfırlama
  await knex.raw('DELETE FROM district');
  await knex.raw('DELETE FROM province');
  // Sayaçları sıfıra çekiyoruz (ilk giriş 1 olacak)
  await knex.raw("DBCC CHECKIDENT ('district', RESEED, 0)");
  await knex.raw("DBCC CHECKIDENT ('province', RESEED, 0)");

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
