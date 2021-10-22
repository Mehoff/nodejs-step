import { readHtml } from "../../helpers/ReadFile.js";
import { RoutesHandler } from "../../routeHandler.js";

export const getImages = RoutesHandler.get("/images", (req, res) => {
  readHtml("./html/images.html", req, res);
});
