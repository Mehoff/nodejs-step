import { readHtml } from "../../helpers/ReadFile.js";
import { RoutesHandler } from "../../routeHandler.js";

export const getBooks = RoutesHandler.get("/books", (req, res) => {
  readHtml("./html/helloWorld.html", req, res);
});
