import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { RoutesHandler } from "./routeHandler.js";
import { getBooks, postBooks } from "./routes/books.js";
import { getHome } from "./routes/home.js";
import { postAuth, getAuth } from "./routes/authorization.js";
import { getBooksForm } from "./routes/book-form.js";
import { getBooksApi } from "./routes/books-api.js";

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  console.log(`Error occured while loading .env config`, dotenvResult.error);
  throw "Failed to load values from .env file, please, fill it with data, and then try to restart application";
}

const router = new RoutesHandler();

// Use these routes
router.use(
  getHome,
  getBooks,
  postBooks,
  postAuth,
  getAuth,
  getBooksForm,
  getBooksApi
);

function serverFunction(req, res) {
  router.handle(req, res);
}

const server = http.createServer(serverFunction);

mongoose.connect(process.env.MONGO_CONNECTION_STRING, (err) => {
  if (err) {
    console.error("MongoDB connection error", err.message);
    return;
  }

  server.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port: ${process.env.APP_PORT}`);
  });
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});
