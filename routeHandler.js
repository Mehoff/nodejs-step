import fs from "fs";
import { ContentTypeMap } from "./helpers/ContentTypeMap.js";
import { getParametersJson } from "./helpers/UrlParser.js";

export class Route {
  constructor(method, url, middleware, func) {
    this.method = method;
    this.url = url;
    this.func = func;
    this.middleware = [];

    if (middleware && middleware.length > 0) {
      this.middleware = middleware;
    }
  }

  exec(req, res, params = {}) {
    if (this.middleware) {
      for (const m of this.middleware) {
        const r = m(req, res);
        if (!r) return;
      }
    }

    if (this.func) this.func(req, res, params);
  }
}

export class RoutesHandler {
  routes = [];

  get = (url = "/", middleware, func) =>
    this.routes.push(new Route("GET", url, middleware, func));
  post = (url = "/", middleware, func) =>
    this.routes.push(new Route("POST", url, middleware, func));
  delete = (url = "/", middleware, func) =>
    this.routes.push(new Route("DELETE", url, middleware, func));

  static get = (url = "/", middleware = [], func) =>
    new Route("GET", url, middleware, func);
  static post = (url = "/", middleware = [], func) =>
    new Route("POST", url, middleware, func);
  static delete = (url = "/", middleware = [], func) =>
    new Route("DELETE", url, middleware, func);

  use(...routes) {
    for (const route of routes) {
      if (route.url && route.func) {
        this.routes.push(route);
      }
    }
  }

  handle(req, res) {
    const split = req.url.split("?");
    const url = split[0];
    const params = split[1];

    const requestedRoute = this.routes.find((route) => {
      return route.url === url && route.method === req.method;
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
      if (params) {
        const paramsObject = getParametersJson(req.url);
        console.log("ParamsObjects:", paramsObject);
        if (paramsObject) requestedRoute.exec(req, res, paramsObject);
      } else {
        requestedRoute.exec(req, res);
      }
    }
  }
}
