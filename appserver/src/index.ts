//
// App Server
//

// TODO: add to git current version
// TODO: do everything with express http server without websockets. Than add WS
// TODO: replace built-in http server with Express running on another port
//       DO NOT merge express http server with WebSocket server, keep them
//       separate
// TODO: send stream to clients-consumers through websocket

import express from "express";
import ws from "ws";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import wav from "wav";
const httpServer = http.createServer();
const { PORT } = process.env;

//

function onRequest(req: any, res: any) {
  console.log(req.headers);
  console.log(`req.url: ${req.url}`);

  let filename = uuidv4(); // TODO: take filename from `uuidv4 || req.params.filename`
  const writableStream = fs.createWriteStream(`./streams/${filename}.wav`);
  //req.pipe(writableStream); // write sreeam to disk, temporary disabled
  req.pipe(res); // FIX: send not to this response but on response for specific endpoint /stream

  req.on("data", (chunk: any) => {
    //console.log(chunk);
  });

  req.on("error", (err: Error) => {
    console.log("error event");
    console.log(err);
  });

  req.on("end", () => {
    console.log("end event");
    res.end();
  });

  req.on("close", () => {
    console.log("close event");
    res.end();
  });
}

//

httpServer.on("request", onRequest);

httpServer.listen(PORT, () => {
  console.log(`App HTTP server is listening on ${PORT}`);
});
