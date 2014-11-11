var mongoose = require('mongoose');
var NamedSet = require('./named_set');

var Database = function(cfg) {
  mongoose.connect(cfg.getDatabaseLocation());
  var schema = mongoose.Schema(cfg.schema());
  this.Employee = mongoose.model(cfg.getTableName(), schema);
};

/**
 * Send the named sets found in the database to the callback function.
 */
Database.prototype.sendDataTo = function(callback) {
  this.Employee.find(function (err, emps) {
    if (err) { console.error(err); }
    else {
      var namedSets = [];
      var i;
      for (i = 0; i < emps.length; i++) {
        namedSets.push(new NamedSet(emps[i].name, emps[i].projects));
      }
      callback(namedSets);
    }
  });
};

/**
 * Open the database, get the required documents, then feed those named sets to
 * the callback function.
 *
 * The callback function must take a list of named sets as an argument.
 */
Database.prototype.openThen = function(callback) {
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  var self = this;
  db.once('open', function cb () {
    self.sendDataTo(callback);
  });
};

module.exports = Database;
