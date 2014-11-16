var mongoose = require('mongoose');
var NamedSet = require('./named_set');

var Database = function(cfg) {
  mongoose.connect(cfg.getDatabaseLocation());
  var schema = mongoose.Schema(cfg.schema());
  this.Model = mongoose.model(cfg.getTableName(), schema);
  this.cfg = cfg;
};

/**
 * Send the named sets found in the database to the callback function.
 */
Database.prototype.sendDataTo = function(callback) {
  var self = this;
  this.Model.find(function (err, models) {
    if (err) { console.error(err); }
    else {
      var namedSets = [];
      var i, j;
      var newSet, data, weight;
      for (i = 0; i < models.length; i++) {
        newSet = new NamedSet(models[i].name);
        for (j = 0; j < self.cfg.getProperties().length; j++) {
          data = models[i][self.cfg.getProperties()[j].getProperty()];
          weight = self.cfg.getProperties()[j].getWeight();
          newSet.addSet(data, weight);
        }
        namedSets.push(newSet);
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
