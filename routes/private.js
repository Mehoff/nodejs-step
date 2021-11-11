import { RoutesHandler } from "../routeHandler.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

export const getPrivate = RoutesHandler.get(
  "/private",
  [ensureAuthenticated],
  (req, res) => {
    res.writeHead(200, "jwt is in the cookie, authenticated");
    res.end("Private route");
  }
);
