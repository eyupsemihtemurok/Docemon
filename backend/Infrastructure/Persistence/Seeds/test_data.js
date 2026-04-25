const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const passwordHash = await bcrypt.hash('Pass123!', 12);

  // 1. ROLES
  const roles = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'ADMIN' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'USER' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'RESCUER' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'COORDINATOR' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'MODERATOR' }
  ];

  for (const role of roles) {
    const exists = await knex('role').where('name', role.name).first();
    if (!exists) {
      await knex('role').insert(role);
    } else {
      role.id = exists.id;
    }
  }

  // 2. USERS
  const users = [
    {
      id: 'A1111111-1111-1111-1111-111111111111',
      full_name: 'Ahmet Yılmaz',
      email: 'ahmet@test.com',
      password: passwordHash,
      blood_type: 'A Rh+',
      safety_status: 'SAFE',
      phone: '5551112233',
      is_active: true
    },
    {
      id: 'B2222222-2222-2222-2222-222222222222',
      full_name: 'Ayşe Demir',
      email: 'ayse@test.com',
      password: passwordHash,
      blood_type: '0 Rh-',
      safety_status: 'IN_DANGER',
      phone: '5552223344',
      is_active: true
    },
    {
      id: 'C3333333-3333-3333-3333-333333333333',
      full_name: 'Mehmet Kaya',
      email: 'mehmet@test.com',
      password: passwordHash,
      blood_type: 'B Rh+',
      safety_status: 'SAFE',
      phone: '5553334455',
      is_active: true
    },
    {
      id: 'D4444444-4444-4444-4444-444444444444',
      full_name: 'Fatma Şahin',
      email: 'fatma@test.com',
      password: passwordHash,
      blood_type: 'AB Rh+',
      safety_status: 'UNKNOWN',
      phone: '5554445566',
      is_active: true
    },
    {
      id: 'E5555555-5555-5555-5555-555555555555',
      full_name: 'Can Özkan',
      email: 'can@test.com',
      password: passwordHash,
      blood_type: 'A Rh-',
      safety_status: 'SAFE',
      phone: '5555556677',
      is_active: true
    }
  ];

  for (const user of users) {
    const exists = await knex('user').where('email', user.email).first();
    if (!exists) {
      await knex('user').insert(user);
    } else {
      user.id = exists.id;
    }
  }

  // 3. USER_ROLES
  const userRoles = [
    { user_id: users[0].id, role_id: roles[0].id },
    { user_id: users[1].id, role_id: roles[1].id },
    { user_id: users[2].id, role_id: roles[2].id },
    { user_id: users[3].id, role_id: roles[1].id },
    { user_id: users[4].id, role_id: roles[3].id }
  ];

  for (const ur of userRoles) {
    const exists = await knex('user_role').where(ur).first();
    if (!exists) await knex('user_role').insert(ur);
  }

  // 4. DISASTERS
  const disasters = [
    {
      id: 'D1111111-1111-1111-1111-111111111111',
      type: 'EARTHQUAKE',
      severity: '7.4',
      location_name: 'Kahramanmaraş',
      latitude: 37.5858,
      longitude: 36.9371,
      description: 'Major earthquake centered in Pazarcık.',
      is_active: true
    },
    {
      id: 'D2222222-2222-2222-2222-222222222222',
      type: 'FLOOD',
      severity: 'HIGH',
      location_name: 'Giresun',
      latitude: 40.9175,
      longitude: 38.3878,
      description: 'Heavy rainfall caused flash floods.',
      is_active: true
    },
    {
      id: 'D3333333-3333-3333-3333-333333333333',
      type: 'FIRE',
      severity: 'CRITICAL',
      location_name: 'Antalya - Manavgat',
      latitude: 36.7875,
      longitude: 31.4421,
      description: 'Forest fire spreading towards residential areas.',
      is_active: false
    },
    {
      id: 'D4444444-4444-4444-4444-444444444444',
      type: 'LANDSLIDE',
      severity: 'MEDIUM',
      location_name: 'Rize',
      latitude: 41.0201,
      longitude: 40.5234,
      description: 'Landslide blocked main highway.',
      is_active: true
    },
    {
      id: 'D5555555-5555-5555-5555-555555555555',
      type: 'EARTHQUAKE',
      severity: '5.2',
      location_name: 'Izmir',
      latitude: 38.4237,
      longitude: 27.1428,
      description: 'Moderate earthquake felt in city center.',
      is_active: true
    }
  ];

  for (const d of disasters) {
    const exists = await knex('disaster').where('id', d.id).first();
    if (!exists) await knex('disaster').insert(d);
  }

  // 5. LOCATIONS
  const locations = [
    { user_id: users[0].id, latitude: 39.9334, longitude: 32.8597, city: 'Ankara' },
    { user_id: users[1].id, latitude: 41.0082, longitude: 28.9784, city: 'Istanbul' },
    { user_id: users[2].id, latitude: 38.4237, longitude: 27.1428, city: 'Izmir' },
    { user_id: users[3].id, latitude: 37.0662, longitude: 37.3833, city: 'Gaziantep' },
    { user_id: users[4].id, latitude: 36.2023, longitude: 36.1606, city: 'Hatay' }
  ];

  for (const loc of locations) {
    await knex('location').insert(loc);
  }

  // 6. AUDIT LOGS
  const logs = [
    { user_id: users[0].id, event_type: 'LOGIN', details: 'Admin logged in' },
    { user_id: users[1].id, event_type: 'STATUS_UPDATE', details: 'User marked as IN_DANGER' },
    { user_id: users[2].id, event_type: 'RESCUE_START', details: 'Rescuer deployed to zone A' },
    { user_id: users[0].id, event_type: 'DISASTER_CREATE', details: 'New earthquake record created' },
    { user_id: users[4].id, event_type: 'LOGOUT', details: 'Coordinator logged out' }
  ];

  for (const log of logs) {
    await knex('audit_log').insert(log);
  }

  // 7. NOTIFICATIONS
  const notifications = [
    { user_id: users[1].id, title: 'Emergency Alert', message: 'Earthquake detected in your area!', type: 'EMERGENCY', is_read: false },
    { user_id: users[3].id, title: 'Safety Check', message: 'Are you safe? Please update your status.', type: 'INFO', is_read: true },
    { user_id: users[0].id, title: 'System Update', message: 'New features added to the dashboard.', type: 'SYSTEM', is_read: false },
    { user_id: users[2].id, title: 'New Task', message: 'Assigned to search and rescue team 5.', type: 'TASK', is_read: false },
    { user_id: users[4].id, title: 'Report Ready', message: 'Monthly disaster report is generated.', type: 'INFO', is_read: false }
  ];

  for (const n of notifications) {
    await knex('notification').insert(n);
  }

  // 8. FRIENDS
  const friends = [
    { sender_id: users[0].id, receiver_id: users[1].id, status: 'ACCEPTED', is_emergency_contact: true },
    { sender_id: users[1].id, receiver_id: users[2].id, status: 'ACCEPTED', is_emergency_contact: false },
    { sender_id: users[3].id, receiver_id: users[0].id, status: 'PENDING', is_emergency_contact: false },
    { sender_id: users[4].id, receiver_id: users[3].id, status: 'ACCEPTED', is_emergency_contact: true },
    { sender_id: users[2].id, receiver_id: users[4].id, status: 'BLOCKED', is_emergency_contact: false }
  ];

  for (const f of friends) {
    const exists = await knex('friend').where({ sender_id: f.sender_id, receiver_id: f.receiver_id }).first();
    if (!exists) await knex('friend').insert(f);
  }

  // 9. VERIFICATION ALERTS
  const alerts = [
    { user_id: users[1].id, image_id: 'img_001', matching_score: 0.95, status: 'APPROVED', health_details: 'Stable', location_details: 'Main street' },
    { user_id: users[3].id, image_id: 'img_002', matching_score: 0.82, status: 'PENDING', health_details: 'Minor injuries', location_details: 'Near park' },
    { user_id: users[2].id, image_id: 'img_003', matching_score: 0.99, status: 'APPROVED', health_details: 'Excellent', location_details: 'Base camp' },
    { user_id: users[4].id, image_id: 'img_004', matching_score: 0.75, status: 'REJECTED', health_details: 'Unknown', location_details: 'Unknown' },
    { user_id: users[0].id, image_id: 'img_005', matching_score: 0.91, status: 'PENDING', health_details: 'Healthy', location_details: 'HQ' }
  ];

  for (const alert of alerts) {
    await knex('verification_alert').insert(alert);
  }

  console.log('Seed verileri başarıyla yüklendi.');
};
