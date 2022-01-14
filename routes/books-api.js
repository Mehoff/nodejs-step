import { RoutesHandler } from "../routeHandler.js";
import { Book } from "../db/schemas/BookSchema.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { getCurrentUser } from "../helpers/CurrentUser.js";
import { readCookie } from "../services/cookies.js";
import { verifyJwt } from "../services/jwt.js";

//
// TODO: add query and params support for RoutesHandler, and filter results in this route function
//

const BOOKS_PER_PAGE = 3;

export const getBooksApi = RoutesHandler.post(
  "/books-api",
  null,
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const page = JSON.parse(data).page;
      const toSkip = BOOKS_PER_PAGE * (page - 1);

      const count = await Book.count({ deleted: false });
      if (count === 0) {
        return res.end(JSON.stringify({ error: "Нет книг для отображения" }));
      }

      const books = await Book.find({ deleted: false })
        .skip(toSkip)
        .limit(BOOKS_PER_PAGE)
        .sort("-uploadedAt");

      if (!books.length)
        return res.end(JSON.stringify({ error: "Failed to load books", page }));

      return res.end(JSON.stringify(books));
    });
  }
);

// Literally COPY of top route. TODO: Delete top route, implement params for routes, and clear this up!

export const getAllBooksApi = RoutesHandler.post(
  "/books-api/all",
  null,
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const page = JSON.parse(data).page;
      const toSkip = BOOKS_PER_PAGE * (page - 1);

      const count = await Book.count({ deleted: false });
      if (count === 0) {
        return res.end(JSON.stringify({ error: "Нет книг для отображения" }));
      }

      const books = await Book.find({ deleted: false })
        .skip(toSkip)
        .limit(BOOKS_PER_PAGE)
        .sort("-uploadedAt");

      if (!books.length)
        return res.end(JSON.stringify({ error: "Failed to load books", page }));

      return res.end(JSON.stringify(books));
    });
  }
);

export const getOwnBooksApi = RoutesHandler.post(
  "/books-api/own",
  [ensureAuthenticated],
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const page = JSON.parse(data).page;
      const toSkip = BOOKS_PER_PAGE * (page - 1);

      const user = await getCurrentUser(req);

      const count = await Book.count({ author: user, deleted: false });
      if (count === 0) {
        return res.end(JSON.stringify({ error: "У вас еще нет своих книг" }));
      }

      const books = await Book.find({ author: user, deleted: false })
        .skip(toSkip)
        .limit(BOOKS_PER_PAGE)
        .sort("-uploadedAt");

      if (!books.length)
        return res.end(
          JSON.stringify({
            error: "Не удалось отобразить книги на этой странице",
            page,
          })
        );

      return res.end(JSON.stringify(books));
    });
  }
);

export const getDeletedBooksApi = RoutesHandler.post(
  "/books-api/deleted",
  null,
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const page = JSON.parse(data).page;
      const toSkip = BOOKS_PER_PAGE * (page - 1);

      const count = await Book.count({ deleted: true });
      if (count === 0) {
        return res.end(JSON.stringify({ error: "Нет удалённых книг" }));
      }

      const books = await Book.find({ deleted: true })
        .skip(toSkip)
        .limit(BOOKS_PER_PAGE)
        .sort("-uploadedAt");

      if (!books.length)
        return res.end(
          JSON.stringify({
            error: "Не удалось отобразить книги на этой странице",
            page,
          })
        );

      return res.end(JSON.stringify(books));
    });
  }
);

export const reviveBooksApi = RoutesHandler.post(
  "/books-api/revive",
  [ensureAuthenticated],
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
  [ensureAuthenticated],
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      const id = JSON.parse(data).bookId;
      if (id) {
        // Get User Id
        const jwt = readCookie(req, "jwt");
        if (!jwt) {
          return res.end(JSON.stringify({ error: "Not authenticated" }));
        }
        const userId = verifyJwt(jwt);

        if (!userId) {
          return res.end(JSON.stringify({ error: "Failed to verify jwt" }));
        }

        const result = await deleteBook(id, userId);

        if (result === null) {
          return res.end(JSON.stringify({ error: "Not enough rights" }));
        }

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

export const getBooksCommentBooksApi = RoutesHandler.post(
  "/books-api/comments",
  null,
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      try {
        const id = JSON.parse(data).bookId;

        const book = await Book.findById(id).populate({
          path: "comments",
          populate: { path: "author", model: "user" },
        });

        const comments = await book.comments;

        if (comments.length > 0) {
          return res.end(JSON.stringify(comments));
        } else {
          return res.end(
            JSON.stringify({ error: "Failed to fetch book comments" })
          );
        }
      } catch (err) {
        console.error(err);
        return res.end(
          JSON.stringify({ error: "Failed to fetch book comments" })
        );
      }
    });
  }
);

const deleteBook = async (id, userId) => {
  const book = await Book.findById(id);

  console.log(`deleteBook()`, id, userId);
  console.log(book.author);

  if (book.author === userId) {
    return await Book.updateOne({ _id: id }, { $set: { deleted: true } });
  } else {
    return null;
  }
};

const reviveBook = async (id) => {
  return await Book.updateOne({ _id: id }, { $set: { deleted: false } });
};
