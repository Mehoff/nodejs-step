import fs from "fs";
import { ContentTypeMap } from "./helpers/ContentTypeMap.js";

export class Route {
  constructor(method, url, func) {
    this.method = method;
    this.url = url;
    this.func = func;
  }

  exec(req, res) {
    if (this.func) this.func(req, res);
  }
}

export class RoutesHandler {
  routes = [];

  get = (url = "/", func) => this.routes.push(new Route("GET", url, func));
  post = (url = "/", func) => this.routes.push(new Route("POST", url, func));
  delete = (url = "/", func) =>
    this.routes.push(new Route("DELETE", url, func));

  static get = (url = "/", func) => new Route("GET", url, func);
  static post = (url = "/", func) => new Route("POST", url, func);
  static delete = (url = "/", func) => new Route("DELETE", url, func);

  use(...routes) {
    for (const route of routes) {
      if (route.url && route.func) {
        this.routes.push(route);
      }
    }
  }

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
}
