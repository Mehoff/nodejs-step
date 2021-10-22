import http from "http";
import { RoutesHandler } from "./routeHandler.js";
import { getBooks, postBooks } from "./routes/books.js";
import { getHome } from "./routes/home.js";

const PORT = 3000;

const router = new RoutesHandler();

router.use(getHome, getBooks, postBooks);

function serverFunction(req, res) {
  router.handle(req, res);
}

const server = http.createServer(serverFunction);
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
