var server   = require('./server');
var database = require('./database');

/**
 * Start the server with the information from the database.
 */
database.openThen(server.execute);
