var clusterfck = require("clusterfck");

var colors = [
  [20, 20, 80],
  [22, 22, 90],
  [250, 255, 253],
  [0, 30, 70],
  [200, 0, 23],
  [100, 54, 100],
  [255, 13, 8]
];

var projects = [
  [1],
  [2],
  [3],
  [4],
  [5],
  [6],
  [7]
];

var clusters = clusterfck.kmeans(projects, 3);
console.log(clusters);


function affinityFactor(numberIn1, numberShared) {
  return numberShared/numberIn1;
}

console.log(affinityFactor(10, 5));
