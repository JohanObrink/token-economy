var hashid = require('../services/hashid'),
  db = require('../services/mongo'),
  _ = require('lodash');

function Economy(data) {
  var self = this;
  if(data) {
    self = data;
    if('function' === Object.setPrototypeOf) {
      Object.setPrototypeOf(self, Economy.prototype);
    } else {
      // jshint proto:true
      self.__proto__ = Object.create(Economy.prototype);
    }
  }

  self.tokens = [];
  return self;
}

Economy.prototype.getTokens = function() {
  var self = this;
  return db.tokens.find({'economy_id': self._id})
    .then(function (tokens) {
      this.tokens = tokens;
      return self;
    })
    .catch(function (err) {
      return self;
    });
};

Economy.prototype.save = function () {

};

Economy.get = function (hashedId) {
  var id = hashid.decodeHex(hashedId);
  var economy;
  return db.economies.find({'_id': id})
    .then(function (economies) {
      if(!economies.length) {
        throw new Error('no such economy');
      } else {
        economy = new Economy(economies[0]);
        return economy.getTokens();
      }
    });
};

module.exports = Economy;