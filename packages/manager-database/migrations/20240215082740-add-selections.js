'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  await db.createTable('selections', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    date: {
      type: 'datetime',
      notNull: true,
    },
    selectionid: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'selection_submission_selectionid_fk',
        table: 'submissions',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          selectionid: 'id'
        }
      }
    },
    guild: {
      type: 'string',
      notNull: true
    }
  });

  return null;
};

exports.down = function (db) {
  db.dropTable('selections')
  return null;
};

exports._meta = {
  "version": 1
};
