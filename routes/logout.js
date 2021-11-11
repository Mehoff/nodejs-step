import { RoutesHandler } from "../routeHandler.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

export const getLogout = RoutesHandler.get(
  "/logout",
  [ensureAuthenticated],
  (req, res) => {
    // res.writeHead(200, {
    //     "Set-Cookie": `jwt=${jwt};expires=1`,
    //     "Content-Type": "text/plain",
    //   });

    res.setHeader("Set-Cookie", "jwt=${jwt};expires=1");
    //res.setHeader("Content-Type", "text/plain");

    res.redirect("/");
    //res.end({status: "ok", redirect: "/"})
  }
);
