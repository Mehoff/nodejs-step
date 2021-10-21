const fs = require("fs");
const ContentTypeMap = require("./helpers/ContentTypeMap");
const { readHtml } = require("./helpers/ReadFile");

class Route {
  constructor(method = "GET", url, htmlPath, func) {
    this.method = method;
    this.url = url;
    this.htmlPath = htmlPath;
    this.func = func;
  }

  exec(req, res) {
    if (this.htmlPath) readHtml(this.htmlPath, req, res);
    else if (this.func) this.func(req, res);
  }
}

class RoutesHandler {
  routes = [];
  handle(req, res) {
    const requestedRoute = this.routes.find((route) => {
      return route.url === req.url && route.method === req.method;
    });

    if (typeof requestedRoute === "undefined") {
      const path = `.${req.url}`;
      if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
        const readStream = fs.createReadStream(path);
        const ext = path.substring(path.lastIndexOf("."), path.length);

        res.setHeader("Content-Type", ContentTypeMap.get(ext));
        readStream.pipe(res);
      } else {
        fs.readFile("./html/404.html", (err, data) => {
          res.statusCode = 404;
          err
            ? res.end("Page does not exist")
            : (res.setHeader("Content-Type", ContentTypeMap.get(".html")),
              res.end(data));
        });
      }
    } else {
      requestedRoute.exec(req, res);
    }
  }

  addRoute(route) {
    this.routes.push(route);
  }
}

module.exports = { Route, RoutesHandler };
