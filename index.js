const http = require("http");
const { Route, RoutesHandler } = require("./routeHandler");

const PORT = 3000;
const Handler = new RoutesHandler();

Handler.addRoute(
  new Route("/", (req, res) => {
    res.end("Home sweet home");
  })
);

Handler.addRoute(
  new Route("/hello", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Hello world!</h1>");
  })
);

Handler.addRoute(
  new Route("/js", (req, res) => {
    res.end("JavaScript is cool!");
  })
);

function serverFunction(req, res) {
  //Handler.foo(req, res);
  Handler.handle(req, res);
}

const server = http.createServer(serverFunction);
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
