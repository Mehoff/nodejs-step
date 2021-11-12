import { RoutesHandler } from "../routeHandler.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

export const getLogout = RoutesHandler.get(
  "/logout",
  [ensureAuthenticated],
  (req, res) => {
    res.setHeader("Set-Cookie", `jwt=junk;max-age=0`);
    //res.setHeader("Content-Type", "text/plain");

    //res.redirect(301, "/");
    res.end(JSON.stringify({ status: "OK", redirect: "/" }));
  }
);
