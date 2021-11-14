import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";
import { Book } from "../db/schemas/BookSchema.js";

export const getComments = RoutesHandler.get(
  "/comments",
  null,
  async (req, res, params) => {
    // Оно сломанное и требует переработаки
    // console.log(params);

    //const book = await Book.findById(params).populate("comments").exec();
    // res.end(JSON.stringify(book.comments));

    readHtml("./html/comments.html", req, res);
  }
);
