import { RoutesHandler } from "../routeHandler.js";
import { Book } from "../db/schemas/BookSchema.js";

export const getBooksApi = RoutesHandler.get(
  "/books-api",
  null,
  async (req, res) => {
    // TODO: add query and params support for RoutesHandler, and filter results in this route function
    const books = await Book.find({ deleted: false });

    if (!books.length) {
      return res.end(JSON.stringify({ error: "Failed to load books" }));
    }

    return res.end(JSON.stringify(books));
  }
);

export const deleteBooksApi = RoutesHandler.delete(
  "/books-api",
  null,
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const id = JSON.parse(data).bookId;
      if (id) {
        const result = await deleteBook(id);

        if (result.err) {
          return res.end(JSON.stringify({ error: "Failed to delete book" }));
        }

        return res.end(
          JSON.stringify({ message: "Successfully deleted book" })
        );
      } else {
        return res.end(JSON.stringify({ error: "Failed to fetch book id" }));
      }
    });
  }
);

const deleteBook = async (id) => {
  return await Book.updateOne({ _id: id }, { $set: { deleted: true } });
};
