import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";

export const getHome = RoutesHandler.get("/", (req, res) => {
  readHtml("./html/home.html", req, res);
});
