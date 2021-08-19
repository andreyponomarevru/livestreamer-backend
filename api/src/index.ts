//
// App Server
//

// TODO: do everything with express http server without websockets. Than
//       introduce WS
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
import { Duplex } from "stream";
const httpServer = express();
const { PORT } = process.env;

/*
// on POST request:
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

*/

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    callback();
  },
  read(size) {},
});

httpServer.post("/stream", (req, res, next) => {
  console.log("POST request");
  console.log("Starting streaming request...");

  req.on("data", (chunk: any) => {
    inoutStream.push(chunk); // check if this process buffers and consumes RAM when nobody listens
    //console.log(`Pushing incoming stream into duplex stream ...`);
    //inoutStream.write(chunk); //
  });
  req.on("error", (err: Error) => console.log(err));
  req.on("end", () => console.log("No more data in stream."));
  req.on("close", () => {
    inoutStream.push(null); // close read stgrteam
    //inoutStream.end(); // close write stream
    console.log("Stream closed.");
  });
});

httpServer.get("/stream", (req, res, next) => {
  console.log("GET request");
  //if (writableStream && writeTo) {
  inoutStream.on("data", () => inoutStream.pipe(res));

  // when broadcaster stops sstreaming implement closing reuest from browser client
  //}
});

httpServer.listen(PORT, () => {
  console.log(`App HTTP server is listening on ${PORT}`);
});
