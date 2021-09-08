import { Duplex } from "stream";

import fs from "fs-extra";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import { HttpError } from "./middlewares/http-errors/HttpError";
import * as db from "../models/user/queries";
import { logger } from "../config/logger";
import { showReadableStreamMode } from "../utils/utils";
import { NODE_ENV, SAVED_STREAMS_DIR } from "./../config/env";

export const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    callback();
  },
  read(size) {},
});
// By default, new streams are set to the 'flowing' mode. But as there is no need to use the stream right after the app's start up, we pause it. This will ease the subsequent management of the stream.
inoutStream.pause();

async function push(req: Request, res: Response): Promise<void> {
  function onData(chunk: Buffer) {
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
    // Push incoming request data into Readable stream in order to be able to consume it later on listener-client request (it doesn't accumulates in memory, it is just lost)
    inoutStream.push(chunk);
    if (NODE_ENV === "production") {
      // Also write incoming request data to disk i.e. push data into writable stream)
      writableStream.write(chunk);
    }
  }

  function onClose() {
    logger.debug(
      "close: Broadcasting client has closed the request (push audio stream).",
    );

    // We shouldn't use 'close' and/or 'end' methods on the read/write streams of our duplex stream, otherwise the broadcast-client won't be able to reconnect and start pushing again until the server restart. 'pause' is the most appropriate alternative to these methods
    inoutStream.pause();
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  }

  logger.debug("Starting push stream from client to server...");

  const writeTo = `${SAVED_STREAMS_DIR}/${uuidv4()}.mp3`;
  const writableStream = fs.createWriteStream(writeTo);
  // When broadcast-client connects, switch the stream back into the 'flowing' mode, otherwise later we won't be able to push data to listener-clients requests
  inoutStream.resume();

  req.on("data", onData);
  req.on("error", logger.error);
  req.on("end", () => logger.debug("end: No more data in stream."));
  req.on("close", onClose);
}

async function pull(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  function onData(chunk: Buffer) {
    res.write(chunk);
  }

  function onPause() {
    logger.debug("pause: Broadcasting client has stopped the stream.");
    // When broadcasting client suddenly stops pushing the stream, we switch the stream to the paused mode (hence this event handler is invoked) — there is nothing to broadcast, hence we end the listener-client's request
    res.end();
  }

  inoutStream.on("data", onData);
  inoutStream.on("pause", onPause);

  // Before doing anything further, check whether the broadcaster-client is actually streaming.
  // If the stream is in the flowing mode, that means the broadcast-client is streaming, hence we're able to send the stream to listener-clients and we set response code to 200. Next, the 'data' event handler will be triggered starting sending the stream.
  // If the stream is paused, it means the broadcaster doesn't stream.
  if (inoutStream.isPaused()) {
    next(new HttpError(404));
  } else {
    res.writeHead(200, {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      connection: "keep-alive",
      "cache-control": "no-cache, no-store, must-revalidate",
      pragma: "no-cache",
      expires: 0,
    });
  }
}

export { push, pull };
