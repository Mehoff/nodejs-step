import { readCookie } from "../services/cookies.js";
import { verifyJwt } from "../services/jwt.js";

export const ensureNotAuthenticated = async (req, res) => {
  const jwt = readCookie(req, "jwt");

  const verified = await verifyJwt(jwt);

  if (verified.error) {
    return true;
  } else {
    res.writeHead(301, { Location: "http://localhost:3000/" });
    res.end();
    return false;
  }
};
