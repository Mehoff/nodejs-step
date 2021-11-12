import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";
import multiparty from "multiparty";
import { User } from "../db/schemas/UserSchema.js";
import { encrypt, compareSync } from "../services/bcrypt.js";
import { createJwt } from "../services/jwt.js";
import { ensureNotAuthenticated } from "../middleware/ensureNotAuthenticated.js";

export const postAuth = RoutesHandler.post(
  "/authorization",
  [ensureNotAuthenticated],
  (req, res) => {
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
          const user = await User.findOne({ email: data["email"] });

          if (!user || !compareSync(data["password"], user.password)) {
            return res.end(
              JSON.stringify({
                error: "Failed to log in, check your credentials and try again",
              })
            );
          }

          await User.findOneAndUpdate(
            { _id: user._id },
            { $push: { authorizations: Date.now() } }
          );

          const jwt = createJwt(user._id);
          res.writeHead(200, {
            "Set-Cookie": `jwt=${jwt};max-age=999999`,
            "Content-Type": "text/plain",
          });
          return res.end(JSON.stringify(user));
        case "false":
          if (data["name"].length < 2)
            return res.end(JSON.stringify({ error: "Bad authorization data" }));

          const password = await encrypt(data["password"]);
          const newUser = {
            email: data["email"],
            password,
            name: data["name"],
            authorizations: [Date.now()],
          };

          User.create(newUser).then((u) => {
            const jwt = createJwt(u._id);
            res.writeHead(200, {
              "Set-Cookie": `jwt=${jwt};max-age=999999`,
              "Content-Type": "text/plain",
            });
            return res.end(JSON.stringify(u));
          });

          break;
        default:
          res.end(JSON.stringify({ error: "Unexpected error had happened" }));
      }
    });

    form.parse(req);
  }
);

export const getAuth = RoutesHandler.get(
  "/authorization",
  [ensureNotAuthenticated],
  (req, res) => {
    readHtml("./html/authorization.html", req, res);
  }
);
