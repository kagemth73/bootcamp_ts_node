import http from "node:http";
import * as fs from "node:fs";
import { log } from "node:console";
const server = http.createServer();
const port = process.env.PORT ?? 12345;
const path = require("path");

server.on("request", async (req, res) => {
  console.log("request url: ", req.url);
  // Content-Type is important for browsers.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types

  let filePath = "./public" + req.url;
  if (filePath === "./public/") {
    filePath = "./public/index.html";
  }

  let extname = String(path.extname(filePath)).toLocaleLowerCase();
  let mimeTypes: Record<string, string | undefined> = {
    ".html": "text/html",
    ".jpg": "image/jpeg",
    ".json": "text/json",
    ".ico": "image/x-ico",
  };
  let contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == "ENOENT") {
        res.writeHead(404);
        console.log("404 NOT FOUND");
        res.end();
      } else {
        res.writeHead(500);
        res.end();
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.on("listening", () => {
  console.log("start listening!");
});

// Start listening 12345 port of localhost (127.0.0.1).
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});
console.log("run server.js");
