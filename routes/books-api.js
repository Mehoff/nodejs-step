import { RoutesHandler } from "../routeHandler.js";
import mongoose from "mongoose";

export const getBooksApi = RoutesHandler.get("./books-api", (req, res) => {
  // TODO: add query and params support for RoutesHandler, and filter results in this route function

  mongoose.connection.db.collection("books", (err, collection) => {
    if (err) {
      return res.end({ error: "Failed to get collection", message: err });
    }
    collection.find({}).toArray((err, data) => {
      if (err) {
        return res.end({ error: "Failed to get collection", message: err });
      }
      return res.end(JSON.stringify(data));
    });
  });
});
