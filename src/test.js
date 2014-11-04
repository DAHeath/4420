var NamedSet = require("./named_set");
var distance = require("./distance");

/**
 * Set of employees to cluster.
 */
var employees = [ new NamedSet('A', ['a', 'c'])
                , new NamedSet('B', ['a', 'd', 'e'])
                , new NamedSet('C', ['b', 'c', 'f'])
                , new NamedSet('D', ['b', 'f'])
                , new NamedSet('E', ['d', 'f'])
                , new NamedSet('F', ['a', 'd'])
                , new NamedSet('G', ['c', 'd'])
                ];

var numClusters = process.argv[2];

var clustering = NamedSet.affinityClustering(employees, numClusters);
console.log(clustering);
console.log(NamedSet.nameClustering(employees, numClusters));

var allAffinities = NamedSet.getAllAffinities(employees);
var positions = distance.allDistancesToFirstTwoItems(allAffinities);
console.log(positions);

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

function getClusterContent(num) {
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

var express = require('express');
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('test',
    { canvasContent: getClusterContent(3)
    , printout: printClustering(NamedSet.nameClustering(employees, 3))
    });
});

app.get('/:id', function(req, res) {
  res.render('test',
    { canvasContent: getClusterContent(req.params.id)
    , printout: printClustering(NamedSet.nameClustering(employees, req.params.id))
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
