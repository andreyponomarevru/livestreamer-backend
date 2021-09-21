import { Duplex, DuplexOptions } from "stream";
import { WriteStream } from "fs";
import EventEmitter from "events";

import fs from "fs-extra";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import { HttpError } from "../../utils/http-errors/http-error";
import { logger } from "../../config/logger";
import { showReadableStreamMode } from "../../utils/utils";
import { NODE_ENV, SAVED_STREAMS_DIR } from "../../config/env";
import * as chatService from "../../ws-server";
import * as broadcastDB from "../../models/broadcast/queries";
import { InOutStream } from "./inout-stream";
import {
  onRequestClose,
  onInOutData,
  onInOutPause,
  onRequestData,
  onRequestEnd,
  onRequestError,
} from "./stream-handlers";
import * as broadcastService from "../broadcast/broadcast";
import streamEvents from "./stream-events";

async function push(req: Request, res: Response): Promise<void> {
  logger.debug("Starting push stream from client to server...");

  const writeTo = `${SAVED_STREAMS_DIR}/${uuidv4()}.mp3`;
  const writableStream = fs.createWriteStream(writeTo);
  // When broadcast-client connects, switch the stream back into the 'flowing' mode, otherwise later we won't be able to push data to listener-clients requests
  inoutStream.resume();

  req.on("data", (chunk: Buffer) => {
    onRequestData(inoutStream, chunk, writableStream);
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  });
  req.on("error", (err) => {
    onRequestError(err);
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  });
  req.on("end", () => {
    onRequestEnd();
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  });
  req.on("close", () => {
    onRequestClose(inoutStream);
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  });
}

async function pull(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  inoutStream.on("data", (chunk: Buffer) => onInOutData(res, chunk));
  inoutStream.on("pause", () => onInOutPause(res));

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

//

async function startStream() {
  const newBroadcast = await broadcastService.createBroadcast();
  streamEvents.start(newBroadcast);
}

async function endStream() {
  streamEvents.end();
  await broadcastDB.update();
}

//

const inoutStream = new InOutStream();
// By default, new streams are set to the 'flowing' mode. But as there is no need to use the stream right after the app's start up, we pause it. This will ease the subsequent management of the stream.
inoutStream.pause();

inoutStream.on("pause", endStream);
inoutStream.on("resume", startStream);

export { inoutStream, startStream, endStream, push, pull };
