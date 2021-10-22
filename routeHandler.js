//const fs = require("fs");

import fs from "fs";

export const ContentTypeMap = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/js; charset=utf-8"],
  [".json", "application/json"],
]);

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

  static get = (url = "/", func) => new Route("GET", url, func);
  static post = (url = "/", func) => new Route("POST", url, func);

  use(route) {
    if (route.url && route.func) {
      this.routes.push(route);
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

// class MyClass {
//   myProp = [];
//   foo(){console.log("foo()")}
// }

//export const Instance = new MyClass();
