var intersection = require("./intersection");

/**
 * The affinity factor of one thing two a second is the number of things the
 * two share over the number of things the first has.
 *
 * This tells how closely related the two things are.
 *
 * If the number of things that the first has is 0, there will be divide by
 * zero problems.
 */
exports.affinityFactor = function(numberIn1, numberShared) {
  return numberShared/numberIn1;
};


function numCommon(arr1, arr2) {
  return intersection.safe(arr1, arr2).length;
}

/**
 * Calculates the set of affinities from one array to each array in a set.
 * The arrays should contain values that are equatable.
 */
exports.allAffinities = function(arr, setToCompareTo) {
  var affinities = [], i, newFactor;
  for (i = 0; i < setToCompareTo.length; i++) {
    newFactor = exports.affinityFactor(
        arr.length,
        numCommon(arr, setToCompareTo[i]));
    affinities.push(newFactor);
  }
  return affinities;
};
