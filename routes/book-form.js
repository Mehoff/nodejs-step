import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";

export const getBooksForm = RoutesHandler.get(
  "/books/add",
  null,
  (req, res) => {
    readHtml("./html/book-form.html", req, res);
  }
);
