const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// 增加请求体大小限制到5MB
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  // 设置请求体大小限制为5MB
  req.maxBodyLength = 5 * 1024 * 1024;
  next();
});

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server started on http://localhost:3000');
});
