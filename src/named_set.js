var affinity = require("./affinity");
var clusterfck = require("clusterfck");

/**
 * A named set is a list with a name.
 */
var NamedSet = function(name, set) {
  this.name = name;
  this.set = set;
}

/**
 * Get the name of the set.
 */
NamedSet.prototype.name = function() {
  return this.name;
}

/**
 * Get the underlying list.
 */
NamedSet.prototype.set = function() {
  return this.set;
}

/**
 * Calculate the affinity factors between this named set and the list of other
 * named sets.
 */
NamedSet.prototype.affinityFactors = function(otherNamedSets) {
  var otherSets = [], i;
  for (i = 0; i < otherNamedSets.length; i++) {
    otherSets.push(otherNamedSets[i].set);
  }
  return affinity.allAffinities(this.set, otherSets);
};

/**
 * Given a set of named sets, generate a mapping from a list of each set's
 * affinity to each other set to the name of that set.
 */
NamedSet.mapAffinitiesToNames = function(setOfNamedSets) {
  var affinityMap = [];
  var i, afs;
  for (i = 0; i < setOfNamedSets.length; i++) {
    afs = setOfNamedSets[i].affinityFactors(setOfNamedSets);
    affinityMap[afs] = setOfNamedSets[i].name;
  }
  return affinityMap;
}

/**
 * Given a set of named sets, generate a list of affinity lists from each set
 * to every other set.
 */
NamedSet.getAllAffinities = function(setOfNamedSets) {
  var allAffinities = [];
  var i, afs;
  for (i = 0; i < setOfNamedSets.length; i++) {
    afs = setOfNamedSets[i].affinityFactors(setOfNamedSets);
    allAffinities.push(afs);
  }
  return allAffinities;
}

NamedSet.nameClustering = function(setOfNamedSets, numClusters) {
  var clustering  = NamedSet.affinityClustering(setOfNamedSets, numClusters);
  var affinityMap = NamedSet.mapAffinitiesToNames(setOfNamedSets);
  var translation = [];
  var i, j, names;
  for (i = 0; i < clustering.length; i++) {
    names = [];
    for (j = 0; j < clustering[i].length; j++) {
      names.push(affinityMap[clustering[i][j]]);
    }
    translation.push(names);
  }
  return translation;
}

NamedSet.affinityClustering = function(setOfNamedSets, numClusters) {
  var allAffinities = NamedSet.getAllAffinities(setOfNamedSets);
  return clusterfck.kmeans(allAffinities, numClusters);
}

module.exports = NamedSet;
