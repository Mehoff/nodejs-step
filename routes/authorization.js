import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";
import multiparty from "multiparty";
import { User } from "../db/schemas/UserSchema.js";
import { encrypt, compare } from "../helpers/bcrypt.js";

export const postAuth = RoutesHandler.post("/authorization", (req, res) => {
  const form = new multiparty.Form();

  const data = {};

  form.on("field", (name, value) => {
    data[name] = value;
  });

  form.on("close", async () => {
    if (
      !data["email"] ||
      !data["password"] ||
      typeof data["isLogin"] === "undefined"
    ) {
      return res.end(JSON.stringify({ error: "Bad authorization data" }));
    }
    switch (data["isLogin"]) {
      case "true":
        const user = await User.find({ email: data["email"] });

        if (!user || !(await compare(user.password, data["password"]))) {
          return res.end(
            JSON.stringify({
              error: "Failed to log in, check your credentials and try again",
            })
          );
        }

        return res.end(JSON.stringify(user));
      case "false":
        if (data["name"].length < 2)
          return res.end(JSON.stringify({ error: "Bad authorization data" }));

        const password = await encrypt(data["password"]);
        const newUser = { email: data["email"], password, name: data["name"] };

        User.create(newUser).then((r) => {
          return res.end(JSON.stringify(r));
        });

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
