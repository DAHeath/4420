var server   = require('./server');
var Database = require('./database');
var Config   = require('./config_reader');

/**
 * Start the server with the information from the database.
 */
function start(cfg) {
  var database = new Database(cfg);
  database.openThen(server.execute);
}

Config.readThen(start);
