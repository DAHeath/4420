/**
 * Calculate the n-dimensional distance between two lists of numbers.
 */
exports.calculate = function(arr1, arr2) {
  var sum = 0, i;
  for (i = 0; i < arr1.length; i++) {
    sum += ((arr1[i] - arr2[i]) * (arr1[i] - arr2[i]));
  }
  return Math.sqrt(sum);
};

/**
 * Calculate the distance of all lists of numbers to the first two items in the
 * list.
 *
 * This allows the creation of a 2D mapping of the list of n-dimensional points.
 *
 * The choice of using the first two points to compare to is entirely arbitrary.
 */
exports.relativeToFirstTwoItems = function(item, items) {
  var position = [];
  position.push(exports.calculate(items[0], item));
  position.push(exports.calculate(items[1], item));
  return position;
};

exports.allDistancesToFirstTwoItems = function(items) {
  var distances = [], i, d;
  for (i = 0; i < items.length; i++) {
    d = exports.relativeToFirstTwoItems(items[i], items);
    distances.push(d);
  }
  return distances;
};
