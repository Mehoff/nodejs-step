const http = require("http");
const ContentTypeMap = require("./helpers/ContentTypeMap");
const { Route, RoutesHandler } = require("./routeHandler");

const PORT = 3000;
const Handler = new RoutesHandler();

Handler.addRoute(
  new Route("GET", "/", null, (req, res) => {
    res.end("Home sweet home");
  })
);

Handler.addRoute(
  new Route("GET", "/hello", null, (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Hello world!</h1>");
  })
);

Handler.addRoute(
  new Route("GET", "/js", null, (req, res) => {
    res.end("JavaScript is cool!");
  })
);

Handler.addRoute(new Route("GET", "/addBook", "./html/images.html"));

Handler.addRoute(
  new Route("GET", "/test", null, (req, res) => {
    res.end(JSON.stringify({ status: true }));
  })
);

Handler.addRoute(
  new Route("POST", "/addBook", null, (req, res) => {
    console.log("POST /addBook");
    res.setHeader("Content-Type", ContentTypeMap.get(".json"));
    res.end(JSON.stringify({ status: "POST /addBook" }));
  })
);

function serverFunction(req, res) {
  Handler.handle(req, res);
}

const server = http.createServer(serverFunction);
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
