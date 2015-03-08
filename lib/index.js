var restify = require('restify'),
  requireDir = require('require-dir'),
  routes = requireDir('./routes');

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.CORS());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(function (req, res, next) {
  var _json = res.json;
  res.json = function (data, headers) {
    if(headers === undefined) { headers = {}; }
    if(!headers['content-type'] && !headers['Content-Type']) {
      headers['content-type'] = 'application/json;charset=utf-8';
    }
    _json.apply(res, [data, headers]);
  };
  return next();
});

server.on('uncaughtException', function () {
  console.error('uncaught exception', arguments.length);
});
server.on('after', function (req, res, route, error) {
  if(error) {
    console.error('error', route, error);
  }
});

server.get('/', routes.index.index);

// auth
server.post('/login', routes.auth.login);
server.get('/logout', routes.auth.logout);

// economies admin
server.get('/economies', routes.economies.list);
server.post('/economies', routes.economies.create);

// economy
server.get('/economies/:id', routes.economies.details);
server.put('/economies/:id', routes.economies.edit);

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});