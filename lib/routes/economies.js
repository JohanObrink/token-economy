var service = require('../services/economies');

function list(req, res, next) {
  return service.getList()
    .then(function (list) {
      res.json(list);
      return next();
    })
    .catch(function (err) {
      return next(err);
    });
}

function create(req, res, next) {
  return service.create(req.body)
    .then(function (result) {
      res.json(201, {id:result._id});
      return next();
    })
    .catch(next);
}

function details(req, res, next) {
  return service.get({id: req.params.id})
    .then(function (economy) {
      res.json(economy);
      return next();
    })
    .catch(function (err) {
      return next(err);
    });
}

function edit(req, res, next) {
  
}

module.exports = {
  list: list,
  create: create,
  details: details,
  edit: edit
};