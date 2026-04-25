const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Tabloları temizle (Sıralama önemli)
  await knex('friend').del();
  await knex('user').del();

  const passwordHash = await bcrypt.hash('Pass123!', 12);

  // 1. Test Kullanıcıları Oluştur
  const users = [
    {
      id: 'A1111111-1111-1111-1111-111111111111',
      full_name: 'Ahmet Yılmaz',
      email: 'ahmet@test.com',
      password: passwordHash,
      blood_type: 'A Rh+',
      safety_status: 'SAFE',
      is_active: true
    },
    {
      id: 'B2222222-2222-2222-2222-222222222222',
      full_name: 'Ayşe Demir',
      email: 'ayse@test.com',
      password: passwordHash,
      blood_type: '0 Rh-',
      safety_status: 'IN_DANGER',
      is_active: true
    },
    {
      id: 'C3333333-3333-3333-3333-333333333333',
      full_name: 'Mehmet Kaya',
      email: 'mehmet@test.com',
      password: passwordHash,
      blood_type: 'B Rh+',
      safety_status: 'SAFE',
      is_active: true
    }
  ];

  await knex('user').insert(users);

  // 2. Arkadaşlık İlişkileri Oluştur
  await knex('friend').insert([
    {
      sender_id: users[0].id, // Ahmet
      receiver_id: users[1].id, // Ayşe
      status: 'ACCEPTED',
      is_emergency_contact: true
    },
    {
      sender_id: users[2].id, // Mehmet
      receiver_id: users[0].id, // Ahmet
      status: 'PENDING',
      is_emergency_contact: false
    }
  ]);

  console.log('Seed verileri başarıyla yüklendi.');
};
