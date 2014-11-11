var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

var employeeSchema = mongoose.Schema({
  name: String,
  projects: [String],
  manager: [String]
});

var Employee = mongoose.model('Employee', employeeSchema);

Employee.remove ({}, function(err) {
  console.log('collection removed');
  console.log(err);
});

var employees = [ new Employee({ name: 'A'
                               , projects: ['a', 'c']
                               , manager: ['Fred']})
                , new Employee({ name: 'B'
                               , projects: ['a', 'd', 'e']
                               , manager: ['George']})
                ];

// var employees = [ new NamedSet('A', ['a', 'c'])
//                 , new NamedSet('B', ['a', 'd', 'e'])
//                 , new NamedSet('C', ['b', 'c', 'f'])
//                 , new NamedSet('D', ['b', 'f'])
//                 , new NamedSet('E', ['d', 'f'])
//                 , new NamedSet('F', ['a', 'd'])
//                 , new NamedSet('G', ['c', 'd'])
//                 ];


function insertEmployees() {
  var i;
  for (i = 0; i < employees.length; i++) {
    employees[i].save();
  }
}


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  insertEmployees();
  console.log('success!');
});
