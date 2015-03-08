var mongo = require('mongod');

var connectionstring = 'mongodb://localhost/token-economy';

module.exports = mongo(connectionstring, ['economies']);