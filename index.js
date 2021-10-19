const http = require("http");
const { Route, RoutesHandler } = require("./routeHandler");

const PORT = 3000;
const Handler = new RoutesHandler();

Handler.addRoute(new Route("/", 200, "Home sweet home"));
Handler.addRoute(new Route("/hello", 200, "Hello world!"));
Handler.addRoute(new Route("/js", 200, "Javascript is cool"));

function serverFunction(req, res) {
  Handler.handle(req, res);
}

const server = http.createServer(serverFunction);
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
