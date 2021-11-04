import { RoutesHandler } from "../routeHandler.js";
import mongoose from "mongoose";
import { Book } from "../db/schemas/BookSchema.js";

export const getBooksApi = RoutesHandler.get("/books-api", async (req, res) => {
  // TODO: add query and params support for RoutesHandler, and filter results in this route function
  const books = await Book.find({ deleted: false });

  if (!books.length) {
    return res.end(JSON.stringify({ error: "Failed to load books" }));
  }

  return res.end(JSON.stringify(books));
});
