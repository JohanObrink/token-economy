var db = require('./mongo');

function getList(filter) {
  return db.economies.find(filter);
}

function create(data) {
  return db.economies.save(data);
}

function get(selector) {
  return db.economies.find(selector)
    .then(function (matches) {
      if(matches.length !== 1) { throw new Error(); }
      else { return matches[0]; }
    })
    .then(function (economy) {
      return db.tokens.find({owner:economy._id})
        .take(50)
        .then(function (tokens) {
          economy.tokens = tokens;
          return economy;
        });
    });

}

module.exports = {
  create: create,
  getList: getList,
  get: get
};