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

function clusteredDistances(unclusteredAffinities, clustering) {
  var clusteredDists = [];
  var dists;
  var i, j;
  for (i = 0; i < clustering.length; i++) {
    dists = [];
    for (j = 0; j < clustering[i].length; j++) {
      dists.push(distance.relativeToFirstTwoItems(
            clustering[i][j], unclusteredAffinities));
    }
    clusteredDists.push(dists);
  }
  return clusteredDists;
}

function scaleFactor(unclusteredAffinities, clustering) {
  var dists = clusteredDistances(unclusteredAffinities, clustering);
  var max = -1;
  var i, j, k;
  for (i = 0; i < dists.length; i++) {
    for (j = 0; j < dists[i].length; j++) {
      for (k = 0; k < dists[i][j].length; k++) {
        if (dists[i][j][k] > max) {
          max = dists[i][j][k];
        }
      }
    }
  }
  return 700/max;
}

function clusteringToCanvasContent(unclusteredAffinities, clustering) {
  var content = "";
  var i, j;
  var dists = clusteredDistances(unclusteredAffinities, clustering);
  var sf = scaleFactor(unclusteredAffinities, clustering);

  for (i = 0; i < dists.length; i++) {
    content += "ctx.fillStyle = '" + colors[i] + "';\n";
    for(j = 0; j < dists[i].length; j++) {
      content += "ctx.fillRect(" +
        dists[i][j][0]*sf + ", " +
        dists[i][j][1]*sf + ", 9, 9);\n";
    }
  }
  return content;
}

function getClusterContent(dataSet, num) {
  var allAffinities = NamedSet.getAllAffinities(dataSet);
  var clustering = NamedSet.affinityClustering(dataSet, num);
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
exports.execute = function(dataSet) {
  var express = require('express');
  var app = express();
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.get('/', function (req, res) {
    res.render('main',
      { canvasContent: getClusterContent(dataSet, 3)
      , printout: printClustering(NamedSet.nameClustering(dataSet, 3))
      });
  });

  app.get('/:num', function(req, res) {
    res.render('main',
      { canvasContent: getClusterContent(dataSet, req.params.num)
      , printout: printClustering(NamedSet.nameClustering(dataSet, req.params.num))
      });
  });

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
};

