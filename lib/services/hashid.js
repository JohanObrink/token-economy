var Hashids = require('hashids');
var hid = new Hashids('my salt');

module.exports = hid;