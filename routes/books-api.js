import { RoutesHandler } from "../routeHandler.js";
import { Book } from "../db/schemas/BookSchema.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { getCurrentUser } from "../helpers/CurrentUser.js";

//
// TODO: add query and params support for RoutesHandler, and filter results in this route function
//

export const getBooksApi = RoutesHandler.get(
  "/books-api",
  null,
  async (req, res) => {
    const books = await Book.find({ deleted: false });

    if (!books.length) {
      return res.end(JSON.stringify({ error: "Failed to load books" }));
    }

    return res.end(JSON.stringify(books));
  }
);

// Literally COPY of top route. TODO: Delete top route, implement params for routes, and clear this up!

export const getAllBooksApi = RoutesHandler.get(
  "/books-api/all",
  null,
  async (req, res) => {
    const books = await Book.find({ deleted: false });

    if (!books.length) {
      return res.end(JSON.stringify({ error: "Failed to load books" }));
    }

    return res.end(JSON.stringify(books));
  }
);

export const getOwnBooksApi = RoutesHandler.get(
  "/books-api/own",
  [ensureAuthenticated],
  async (req, res) => {
    const user = await getCurrentUser(req);

    const books = await Book.find({ author: user._id, deleted: false });

    if (!books.length) {
      return res.end(JSON.stringify({ error: "Failed to load books" }));
    }

    return res.end(JSON.stringify(books));
  }
);

export const getDeletedBooksApi = RoutesHandler.get(
  "/books-api/deleted",
  null,
  async (req, res) => {
    const books = await Book.find({ deleted: true });

    if (!books.length) {
      return res.end(JSON.stringify({ error: "Failed to load books" }));
    }

    return res.end(JSON.stringify(books));
  }
);

export const reviveBooksApi = RoutesHandler.post(
  "/books-api/revive",
  null,
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const id = JSON.parse(data).bookId;
      if (id) {
        const result = await reviveBook(id);

        if (result.err) {
          return res.end(JSON.stringify({ error: "Failed to revive book" }));
        }

        return res.end(JSON.stringify({ message: "Successfully revive book" }));
      } else {
        return res.end(JSON.stringify({ error: "Failed to fetch book id" }));
      }
    });
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

const reviveBook = async (id) => {
  return await Book.updateOne({ _id: id }, { $set: { deleted: false } });
};
