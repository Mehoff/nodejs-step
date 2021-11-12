import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { clearDatabaseData, fillDatabaseWithFixtures } from "./db/db.js";

// Routes
import { RoutesHandler } from "./routeHandler.js";
import { getBooks, postBooks } from "./routes/books.js";
import { getHome } from "./routes/home.js";
import { postAuth, getAuth } from "./routes/authorization.js";
import { getBooksForm } from "./routes/book-form.js";
import {
  getBooksApi,
  getAllBooksApi,
  getOwnBooksApi,
  getDeletedBooksApi,
  deleteBooksApi,
  reviveBooksApi,
} from "./routes/books-api.js";
import { getPrivate } from "./routes/private.js";
import { getLogout } from "./routes/logout.js";

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  console.log(`Error occured while loading .env config`, dotenvResult.error);
  throw "Failed to load values from .env file, please, fill it with data, and then try to restart application";
}

const router = new RoutesHandler();

// Для генерации данных перед их тестированием, установить в true
const reInitializeDatabase = true;

// Use these routes
router.use(
  getHome,
  getBooks,
  postBooks,
  postAuth,
  getAuth,
  getBooksForm,
  getBooksApi,
  getAllBooksApi,
  getOwnBooksApi,
  getDeletedBooksApi,
  deleteBooksApi,
  reviveBooksApi,
  getPrivate,
  getLogout
);

function serverFunction(req, res) {
  router.handle(req, res);
}

const server = http.createServer(serverFunction);

mongoose.connect(process.env.MONGO_CONNECTION_STRING, async (err) => {
  if (err) {
    console.error("MongoDB connection error", err.message);
    return;
  }

  server.listen(process.env.APP_PORT, async () => {
    console.log(`Listening on port: ${process.env.APP_PORT}`);

    if (reInitializeDatabase) {
      await clearDatabaseData();
      await fillDatabaseWithFixtures();
    }
  });
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

//    TODO:

// Add user jwt authentication +
// Add route middleware support +
// Add ensureAuthenticated middleware +
// Add 'author' field in book schema +
// Add <select> too books.html, and option 'deleted' +
// Add button to 'undo deletion' for deleted books
// Save data about user log in timestamp +
// Navbar +
// Logout button +
// Pagination
// Likes/Dislikes

//    May be cool thing TODO:
// req.user
