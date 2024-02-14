'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('submissions', {
    id: {
      type: 'int', 
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    submission_date: {
      type: 'date',
      notNull: true,
    },
    user_id: {
      type: 'text',
      notNull: true,
    },
    submission_info: {
      type: 'jsonb',
      notNull: true
    },
    });


  return null;
};

exports.down = function(db) {
  db.dropTable('submissions')

  return null
};

exports._meta = {
  "version": 1
};