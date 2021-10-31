import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";
import multiparty from "multiparty";
import { Book, BookSchema } from "../db/schemas/BookSchema.js";

export const postBooks = RoutesHandler.post("/books", (req, res) => {
  let response = {};
  // Saving image to /uploads
  const form = new multiparty.Form({ uploadDir: "./uploads" });

  form.on("error", (err) => {
    res.end(JSON.stringify({ error: err.message }));
  });

  form.on("file", (name, file) => {
    response.imagePath = file.path;
    response.originalName = file.originalName;
  });

  form.on("field", (name, value) => {
    response[name] = value;
  });

  form.on("close", async () => {
    const book = new Book();

    book.title = response.name;
    book.description = response.description;
    book.path = response.imagePath;

    await book.save();

    res.end(JSON.stringify(response));
  });

  form.parse(req);
});

export const getBooks = RoutesHandler.get("/books", (req, res) => {
  readHtml("./html/books.html", req, res);
});
