var mongoose = require('mongoose');
var NamedSet = require("./named_set");

mongoose.connect('mongodb://localhost/test');

var employeeSchema = mongoose.Schema({
  name: String,
  projects: [String]
});

var Employee = mongoose.model('Employee', employeeSchema);
var employees;

/**
 * Send the named sets found in the database to the callback function.
 */
function sendEmployeesTo(callback) {
  Employee.find(function (err, emps) {
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
}

/**
 * Open the database, get the required documents, then feed those named sets to
 * the callback function.
 *
 * The callback function must take a list of named sets as an argument.
 */
exports.openThen = function(callback) {
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function cb () {
    sendEmployeesTo(callback);
  });
};

