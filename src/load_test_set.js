var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

var employeeSchema = mongoose.Schema({
  name: String,
  projects: [String],
  manager: [String]
});

var Employee = mongoose.model('Employee', employeeSchema);


var employees = [ new Employee({ name: 'A'
                               , projects: ['a', 'c']
                               , manager: ['Fred']})
                , new Employee({ name: 'B'
                               , projects: ['a', 'd', 'e']
                               , manager: ['George']})
                , new Employee({ name: 'C'
                               , projects: ['b', 'c', 'f']
                               , manager: ['Fred']})
                , new Employee({ name: 'D'
                               , projects: ['b', 'f']
                               , manager: ['George']})
                , new Employee({ name: 'E'
                               , projects: ['d', 'f']
                               , manager: ['Frank']})
                , new Employee({ name: 'F'
                               , projects: ['a', 'd']
                               , manager: ['Frank']})
                , new Employee({ name: 'G'
                               , projects: ['c', 'd']
                               , manager: ['Frank']})
                ];

function insertEmployees() {
  var i;
  for (i = 0; i < employees.length; i++) {
    employees[i].save(function(err) {
      if (err) { console.log(err); }
      else { console.log('saved emp'); }
    });
  }
}


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  Employee.remove ({}, function(err) {
    if (err) { console.log(err); }
    else {
      console.log('collection removed');
      insertEmployees();
      console.log('success!');
    }
  });
});
