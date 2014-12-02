/* finds the intersection of
 * two arrays in a simple fashion.
 *
 * PARAMS
 *  a - first array, must already be sorted
 *  b - second array, must already be sorted
 *
 * NOTES
 *
 *  Should have O(n) operations, where n is
 *    n = MIN(a.length(), b.length())
 */
exports.safe = function(a, b) {
  var ai = 0, bi = 0;
  var result = [];

  while( ai < a.length && bi < b.length ) {
     if      (a[ai] < b[bi] ){ ai++; }
     else if (a[ai] > b[bi] ){ bi++; }
     else /* they're equal */ {
       result.push(a[ai]);
       ai++;
       bi++;
     }
  }
  return result;
};

exports.union = function(x, y) {
  var obj = {};
  var i;
  for (i = x.length-1; i >= 0; -- i) {
    obj[x[i]] = x[i];
  }
  for (i = y.length-1; i >= 0; -- i) {
    obj[y[i]] = y[i];
  }
  var res = [];
  for (i in obj) {
    res.push(obj[i]);
  }
  return res;
};

