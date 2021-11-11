export const getCookies = (req) => {
  const list = {};
  const cookies = req.headers.cookie;

  cookies &&
    cookies.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });

  return list;
};

export const readCookie = (req, cookie) => {
  const list = getCookies(req);
  return list[cookie];
};
