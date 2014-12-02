var fs = require('fs');

if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) === str;
  };
  String.prototype.afterColon = function() {
    return this.split(': ')[1];
  };
}

var WeightedProperty = function(property, weight, type) {
  this.property = property;
  this.weight = weight;
  this.type = type;
};

WeightedProperty.prototype.getProperty = function() {
  return this.property;
};

WeightedProperty.prototype.getWeight = function() {
  return this.weight;
};

WeightedProperty.prototype.getType = function() {
  return this.type;
};

function parseType(s) {
  if (s === "String") { return String; }
  if (s === "[String]") { return [String] }
}

WeightedProperty.build = function(line) {
  var aboutComma = line.split(', ');
  if (!aboutComma[0].startsWith('property')) { throw "bad property"; }
  var name = aboutComma[0].afterColon();
  var weight = parseFloat(aboutComma[1].afterColon());
  var type = parseType(aboutComma[2].afterColon());
  return new WeightedProperty(name, weight, type);
};

var Config = function() {
  this.properties = [];
};

Config.prototype.setDatabaseLocation = function(dbLoc) {
  this.dbLoc = dbLoc;
};

Config.prototype.getDatabaseLocation = function() {
  return this.dbLoc;
};

Config.prototype.setTableName = function(table) {
  this.table = table;
};

Config.prototype.getTableName = function() {
  return this.table;
};

Config.prototype.setName = function(name) {
  this.name = name;
};

Config.prototype.getName = function() {
  return this.name;
};

Config.prototype.addProperty = function(property) {
  this.properties.push(property);
};

Config.prototype.getProperties = function() {
  return this.properties;
};

Config.prototype.schema = function() {
  var n = this.getName();
  var schema = {};
  schema[n] = String;
  var i;
  for (i = 0; i < this.properties.length; i++) {
    schema[this.properties[i].getProperty()] = this.properties[i].getType();
  }
  return schema;
};

Config.build = function(lines) {
  var cfg = new Config();
  var i;
  for (i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('database_location')) {
      cfg.setDatabaseLocation(lines[i].afterColon());
    } else if (lines[i].startsWith('table')) {
      cfg.setTableName(lines[i].afterColon());
    } else if (lines[i].startsWith('property')) {
      cfg.addProperty(WeightedProperty.build(lines[i]));
    } else if (lines[i].startsWith('name')) {
      cfg.setName(lines[i].afterColon());
    }
  }
  return cfg;
};

Config.readThen = function(callback) {
  fs.readFile('./config', 'utf8', function (err, data) {
    if (err) { throw err; }
    var lines = data.split('\n');
    var config = Config.build(lines);
    callback(config);
  });
};


module.exports = Config;
