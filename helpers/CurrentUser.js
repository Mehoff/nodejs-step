import { readCookie } from "../services/cookies.js";
import { verifyJwt } from "../services/jwt.js";
import { User } from "../db/schemas/UserSchema.js";

export const getCurrentUser = async (req) => {
  const jwt = readCookie(req, "jwt");

  if (!jwt) return null;

  const id = await verifyJwt(jwt);

  if (id.error) return null;

  const user = await User.findById(id);

  return user;
};
