const migration = require('./20260425_0001_initial_schema');

exports.up = migration.up;
exports.down = migration.down;