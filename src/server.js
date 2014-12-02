var numClusters = process.argv[2];
var NamedSet = require("./named_set");
var distance = require("./distance");
var fs = require('fs');

var colors = [ '#ff0000'
             , '#00ff00'
             , '#0000ff'
             , '#000000'
             , '#ffff00'
             , '#ff00ff'
             , '#00ffff'
             ];

function clusteredDistances(nameMapping, unclusteredAffinities, clustering) {
  var clusteredDists = [];
  var dists;
  var i, j;
  for (i = 0; i < clustering.length; i++) {
    dists = [];
    for (j = 0; j < clustering[i].length; j++) {
      dists.push({ name: nameMapping[clustering[i][j]],
                   dist: distance.relativeToFirstTwoItems(
            clustering[i][j], unclusteredAffinities) });
    }
    clusteredDists.push(dists);
  }
  return clusteredDists;
}

function scaleFactor(nameMapping, unclusteredAffinities, clustering) {
  var dists = clusteredDistances(nameMapping, unclusteredAffinities, clustering);
  var max = -1;
  var i, j, k;
  for (i = 0; i < dists.length; i++) {
    for (j = 0; j < dists[i].length; j++) {
      for (k = 0; k < dists[i][j].dist.length; k++) {
        if (dists[i][j].dist[k] > max) {
          max = dists[i][j].dist[k];
        }
      }
    }
  }
  return 700/max;
}

function clusteringToCanvasContent(nameMapping, unclusteredAffinities, clustering) {
  var content = [];
  var i, j;
  var dists = clusteredDistances(nameMapping, unclusteredAffinities, clustering);
  var sf = scaleFactor(nameMapping, unclusteredAffinities, clustering);

  for (i = 0; i < dists.length; i++) {
    for(j = 0; j < dists[i].length; j++) {
      content.push(
          { name:  dists[i][j].name,
            left:  dists[i][j].dist[0]*sf,
            top:   dists[i][j].dist[1]*sf,
            color: colors[i] });
    }
  }
  return content;
}

function getClusterContent(dataSet, num) {
  var startTime = new Date().getTime();

  var allAffinities = NamedSet.getAllAffinities(dataSet);
  var clustering = NamedSet.affinityClustering(dataSet, num);
  var nameMapping = NamedSet.mapAffinitiesToNames(dataSet);
  var temp = clusteringToCanvasContent(nameMapping, allAffinities, clustering);

  var endTime = new Date().getTime();

  console.log('Execution Time: ' + (endTime - startTime));

  return temp;
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

