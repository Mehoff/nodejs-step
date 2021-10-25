import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";
import multiparty from "multiparty";
import Db from "../configs/users.json";

export const postAuth = RoutesHandler.post("/authorization", (req, res) => {
  const form = new multiparty.Form();

  const data = {};

  form.on("field", (name, value) => {
    data[name] = value;
  });

  form.on("close", () => {
    if (
      !data["login"] ||
      !data["password"] ||
      typeof data["isLogin"] === "undefined"
    ) {
      res.end(JSON.stringify({ error: "Bad authorization data" }));
      return;
    }
    switch (data["isLogin"]) {
      case "true":
        const user = Db.users.find(
          (user) =>
            user.login === data["login"] && user.password === data["password"]
        );
        user
          ? res.end(JSON.stringify(user))
          : res.end(JSON.stringify({ error: "User was not found" }));
        break;
      case "false":
        const newUser = { login: data["login"], password: data["password"] };
        Db.users.push(newUser);
        res.end(JSON.stringify(newUser));
        break;
      default:
        res.end(JSON.stringify({ error: "Unexpected error had happened" }));
    }
  });

  form.parse(req);
});

export const getAuth = RoutesHandler.get("/authorization", (req, res) => {
  readHtml("./html/authorization.html", req, res);
});
