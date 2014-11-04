var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var employeeSchema = mongoose.Schema({
  name: String
});

var Employee = mongoose.model('Employee', employeeSchema);

function insertEmployee() {
  var e1 = new Employee({ name: "David" });
  e1.save(function (err, e1) {
    if (err) { console.error(err); }
    else { console.log(e1.name); }
  });
}

function getEmployees() {
  Employee.find(function (err, employees) {
    if (err) { console.error(err); }
    else { console.log(employees); }
  });
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  getEmployees();
  console.log('success!');
});
