// import { readCookie } from "../services/cookies.js";
// import { verifyJwt } from "../services/jwt.js";

// export const sameUser = (req, res) => {
//   const jwt = readCookie(req, "jwt");
//   if (jwt) {
//     const id = verifyJwt(jwt);
//     if (id.error) {
//       console.error("ensureAuthenticated.error", id.error);
//       res.writeHead(403, "Not authenticated");
//       res.end({ error: "Failed to verify your identity" });
//       return false;
//     }
//     return true;
//   }
//   res.writeHead(403, "Not authenticated");
//   res.end(JSON.stringify({ error: "Not authenticated" }));
//   return false;
// };
