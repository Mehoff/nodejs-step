import fs from "fs";
import { ContentTypeMap } from "./ContentTypeMap.js";

export const readHtml = (path, req, res) => {
  if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
    const readStream = fs.createReadStream(path);
    const ext = path.substring(path.lastIndexOf("."), path.length);

    res.setHeader("Content-Type", ContentTypeMap.get(ext));
    readStream.pipe(res);
  } else {
    fs.readFile("./html/404.html", (err, data) => {
      res.statusCode = 404;

      if (err) {
        console.log(err);
        res.end("Page does not exist");
      } else {
        res.setHeader("Content-Type", ContentTypeMap.get(".html")),
          res.end(data);
      }
    });
  }
};

export const readFile = (path) => {
  if (fs.existsSync(path) && fs.lstatSync(path).isFile())
    return fs.createReadStream(path);
  else return null;
};
