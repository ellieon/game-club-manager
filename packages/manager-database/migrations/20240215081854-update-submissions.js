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
  db.runSql('delete from submissions where 1=1;');
  db.addColumn('submissions', 'guild', {
      type: 'text',
      notNull: true,
      default: '0',
  });
  return null;
};

exports.down = function(db) {
  db.removeColumn('submissions', 'guild');
  return null;
};

exports._meta = {
  "version": 1
};
