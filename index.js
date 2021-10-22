import http from "http";
import { RoutesHandler } from "./routeHandler.js";
//import { getBooks } from "./routes/get/books.js";
//import { getImages } from "./routes/get/images.js";

import { getBooks } from "./routes/get/books.js";
import { getImages } from "./routes/get/images.js";

const PORT = 3000;

const router = new RoutesHandler();

router.get("/", (req, res) => {
  res.end("Home sweet home");
});

router.get("/js", (req, res) => {
  res.end("Javascript is cool!");
});

router.use(getBooks);
router.use(getImages);

function serverFunction(req, res) {
  router.handle(req, res);
}

const server = http.createServer(serverFunction);
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
