var NamedSet = require("./named_set");
var distance = require("./distance");

/**
 * Set of employees to cluster.
 */
var employees = [
  new NamedSet('A', ['a', 'c']),
  new NamedSet('B', ['a', 'd', 'e']),
  new NamedSet('C', ['b', 'c', 'f']),
  new NamedSet('D', ['b', 'f']),
  new NamedSet('E', ['d', 'f']),
  new NamedSet('F', ['a', 'd']),
];

console.log(NamedSet.affinityClustering(employees));
console.log(NamedSet.nameClustering(employees));
console.log(NamedSet.mapAffinitiesToNames(employees));

var allAffinities = NamedSet.getAllAffinities(employees);
console.log(distance.relativeToFirstTwoItems(allAffinities));

