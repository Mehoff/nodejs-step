const fs = require("fs");
const ContentTypeMap = require("./ContentTypeMap");

const readHtml = (path, req, res) => {
  if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
    const readStream = fs.createReadStream(path);
    const ext = path.substring(path.lastIndexOf("."), path.length);

    res.setHeader("Content-Type", ContentTypeMap.get(ext));
    readStream.pipe(res);
  } else {
    fs.readFile("../html/404.html", (err, data) => {
      res.statusCode = 404;
      err
        ? res.end("Page does not exist")
        : (res.setHeader("Content-Type", ContentTypeMap.get(".html")),
          res.end(data));
    });
  }
};

module.exports = { readHtml };
