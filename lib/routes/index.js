
function index(req, res, next) {
  res.send({
    links: [
      {
        rel: 'login',
        href: '/login',
        method: 'POST'
      },
      {
        rel: 'create',
        href: '/economies',
        method: 'POST'
      }
    ]
  });
}

module.exports = {
  index: index
};