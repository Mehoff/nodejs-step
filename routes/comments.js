import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";
import { Book } from "../db/schemas/BookSchema.js";

export const getComments = RoutesHandler.get(
  "/comments",
  null,
  async (req, res, params) => {
    readHtml("./html/comments.html", req, res);
  }
);
