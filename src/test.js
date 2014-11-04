var NamedSet = require("./named_set");
var distance = require("./distance");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var employeeSchema = mongoose.Schema({
  name: String,
  projects: [String]
});
var Employee = mongoose.model('Employee', employeeSchema);

var employees;

function getEmployees() {
  Employee.find(function (err, emps) {
    if (err) { console.error(err); }
    else {
      console.log(emps);
      var namedSets = [];
      var i;
      for (i = 0; i < emps.length; i++) {
        namedSets.push(new NamedSet(emps[i].name, emps[i].projects));
      }
      console.log(namedSets);
      executeServer(namedSets);
    }
  });
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  getEmployees();
  console.log('success!');
});

/**
 * Set of employees to cluster.
 */
// var employees = [ new NamedSet('A', ['a', 'c'])
//                 , new NamedSet('B', ['a', 'd', 'e'])
//                 , new NamedSet('C', ['b', 'c', 'f'])
//                 , new NamedSet('D', ['b', 'f'])
//                 , new NamedSet('E', ['d', 'f'])
//                 , new NamedSet('F', ['a', 'd'])
//                 , new NamedSet('G', ['c', 'd'])
//                 ];

var numClusters = process.argv[2];

var colors = [ '#ff0000'
             , '#00ff00'
             , '#0000ff'
             , '#000000'
             , '#ffff00'
             , '#ff00ff'
             , '#00ffff'
             ];

function clusteringToCanvasContent(unclusteredAffinities, clustering) {
  var content = "";
  var i, j;
  var position;
  for (i = 0; i < clustering.length; i++) {
    content += "ctx.fillStyle = '" + colors[i] + "';\n";
    for(j = 0; j < clustering[i].length; j++) {
      position = distance.relativeToFirstTwoItems(
          clustering[i][j], unclusteredAffinities);
      content += "ctx.fillRect(" +
        position[0]*200 + ", " +
        position[1]*200 + ", 9, 9);\n";
    }
  }
  return content;
}

function getClusterContent(employees, num) {
  console.log(employees);
  var allAffinities = NamedSet.getAllAffinities(employees);
  var clustering = NamedSet.affinityClustering(employees, num);
  return clusteringToCanvasContent(allAffinities, clustering);
}

function printClustering(clustering) {
  var res = "";
  var i;
  for (i = 0; i < clustering.length; i++) {
    res += '[' + clustering[i] + '] ';
  }
  return res;
}

function executeServer(employees) {
  var express = require('express');
  var app = express();
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.get('/', function (req, res) {
    res.render('test',
      { canvasContent: getClusterContent(employees, 3)
      , printout: printClustering(NamedSet.nameClustering(employees, 3))
      });
  });

  app.get('/:id', function(req, res) {
    res.render('test',
      { canvasContent: getClusterContent(employees, req.params.id)
      , printout: printClustering(NamedSet.nameClustering(employees, req.params.id))
      });
  });

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}

