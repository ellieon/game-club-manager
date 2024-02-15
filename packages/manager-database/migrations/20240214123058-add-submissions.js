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
    date: {
      type: 'date',
      notNull: true,
    },
    id: {
      type: 'text',
      notNull: true,
    },
    info: {
      type: 'jsonb',
      notNull: true
    },
    pending: {
      type: 'boolean',
      notNull: true
    },
    gameid: {
      type: 'string',
      notNull: false
    }
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