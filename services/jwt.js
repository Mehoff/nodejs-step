import jwt from "jsonwebtoken";
/**
 *
 * @param userId Payload for jwt signing, we use user`s id for this case
 * @param expires By default, jwt token expire date set to 3 months, you can change it by passing another value
 * @returns {string} Jwt token string
 */
export const createJwt = (userId, expires = 3 * 30 * 24 * 60 * 60 * 1000) => {
  return jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: expires,
  });
};

/**
 *
 * @param token Jwt token
 * @returns {Promise<any>} Returns data which was encrypted using secret (user`s id). Or return object with 'error' prop if something went wrong
 */
export const verifyJwt = async (token) => {
  if (!token) return { error: "Invalid token" };
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      err ? reject({ error: "Failed to verify jwt" }) : resolve(decodedToken);
    });
  });
};
