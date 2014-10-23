var clusterfck = require("clusterfck");
var employees  = require("./employee");

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
function intersect_safe(a, b) {
  var ai=0, bi=0;
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
}

function affinityFactor(numberIn1, numberShared) {
  return numberShared/numberIn1;
}


/**
 * Employee class which has a name and a set of projects.
 */
function Employee(name, projects) {
  this.name     = name;
  this.projects = projects;
}
Employee.prototype.getProjects = function() {
  return this.projects;
};
Employee.prototype.numCommonProjects = function(otherEmp) {
  return intersect_safe(this.projects, otherEmp.getProjects()).length;
};
Employee.prototype.numProjects = function() {
  return this.projects.length;
};
Employee.prototype.affinityFactors = function(emps) {
  var afs = [], i;
  for (i = 0; i < emps.length; i++) {
    afs.push(affinityFactor(this.numProjects(), this.numCommonProjects(emps[i])));
  }
  return afs;
};
Employee.prototype.getName = function() {
  return this.name;
};


/**
 * Set of employees to cluster.
 */
var employees = [
  new Employee("A", ['a', 'c']),
  new Employee("B", ['a', 'd', 'e']),
  new Employee("C", ['b', 'c', 'f']),
  new Employee("D", ['b', 'f']),
  new Employee("E", ['d', 'f']),
  new Employee("F", ['a', 'd']),
];


/**
 * Find all of the affinities of each employee to all employees. This produces
 * an array of numbers where each number is the affinity to the respective
 * employee.
 */
var allAffinities = [];
var affinityMap = [];
for (var i = 0; i < employees.length; i++) {
  var afs = employees[i].affinityFactors(employees);
  affinityMap[afs] = employees[i].getName();
  allAffinities.push(afs);
}

/**
 * Clusters the employees based on their affinities to one another.
 */
var clustering = clusterfck.kmeans(allAffinities, 3);


/**
 * Translate the ugly clustering result into a clustering of employee names.
 */
var translation = [];
for (var i = 0; i < clustering.length; i++) {
  var names = [];
  for (var j = 0; j < clustering[i].length; j++) {
    names.push(affinityMap[clustering[i][j]])
  }
  translation.push(names);
}

console.log(translation);
