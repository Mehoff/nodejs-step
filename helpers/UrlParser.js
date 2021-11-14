export function getParametersJson(url) {
  const query = url.split("?")[1];
  const params = query.split("&");

  const result = {};
  for (const param of params) {
    const item = param.split("=");
    result[item[0]] = item[1];
  }

  return result;
}
