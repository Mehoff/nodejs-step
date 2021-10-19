class Route {
  constructor(url, statusCode, message) {
    this.url = url;
    this.statusCode = statusCode;
    this.message = message;
  }

  exec(req, res) {
    res.statusCode = this.statusCode;
    res.end(this.message);
  }
}

class RoutesHandler {
  routes = [];
  handle(req, res) {
    const requestedRoute = this.routes.find((route) => {
      return route.url === req.url;
    });
    if (!requestedRoute) {
      res.statusCode = 404;
      res.end("404");
      return;
    }
    requestedRoute.exec(req, res);
  }

  addRoute(route) {
    this.routes.push(route);
  }
}

module.exports = { Route, RoutesHandler };
