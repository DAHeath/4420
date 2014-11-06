var numClusters = process.argv[2];
var NamedSet = require("./named_set");
var distance = require("./distance");

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

/**
 * Start up the server using a list of named sets to populate the clustering
 * chart.
 */
exports.execute = function(employees) {
  var express = require('express');
  var app = express();
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.get('/', function (req, res) {
    res.render('main',
      { canvasContent: getClusterContent(employees, 3)
      , printout: printClustering(NamedSet.nameClustering(employees, 3))
      });
  });

  app.get('/:id', function(req, res) {
    res.render('main',
      { canvasContent: getClusterContent(employees, req.params.id)
      , printout: printClustering(NamedSet.nameClustering(employees, req.params.id))
      });
  });

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
};

