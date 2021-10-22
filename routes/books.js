import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";

export const postBooks = RoutesHandler.post("/books", (req, res) => {
  console.log("POST /books");
  res.end(JSON.stringify({ status: true }));
});

export const getBooks = RoutesHandler.get("/books", (req, res) => {
  readHtml("./html/books.html", req, res);
});
