import { WriteStream } from "fs";

import { Response } from "express";

import { logger } from "../../config/logger";
import { showReadableStreamMode } from "../../utils/utils";
import { NODE_ENV } from "../../config/env";
import * as chatService from "../../ws-server";
import * as broadcastDB from "../../models/broadcast/queries";
import * as broadcastService from "../broadcast/broadcast";
import { Duplex } from "stream";

export function onRequestData(
  inoutStream: Duplex,
  chunk: Buffer,
  writableStream: WriteStream,
) {
  showReadableStreamMode(inoutStream, "broadcaster's push stream");

  // Push incoming request data into Readable stream in order to be able to consume it later on listener-client request (it doesn't accumulates in memory, it is just lost)
  inoutStream.push(chunk);
  if (NODE_ENV === "production") {
    // Write incoming request data to disk i.e. push data into writable stream)
    writableStream.write(chunk);
  }
}

export function onRequestError(err: Error) {
  logger.error(err);
}

export function onRequestEnd() {
  logger.debug("end: No more data in request stream.");
}

export function onRequestClose(inoutStream: Duplex) {
  logger.debug(
    "close: Broadcasting client has closed the request (push audio stream).",
  );

  // We shouldn't use 'close' and/or 'end' methods on the read/write streams of our duplex stream, otherwise the broadcast-client won't be able to reconnect and start pushing again until the server restart. 'pause' is the most appropriate alternative to these methods
  inoutStream.pause();
}

export function onInOutPause(res: Response) {
  logger.debug("pause: Broadcasting client has stopped the stream.");
  // When broadcasting client suddenly stops pushing the stream, we switch the stream to the paused mode (hence this event handler is invoked) — there is nothing to broadcast, hence we end the listener-client's request
  res.end();
}

export function onInOutData(res: Response, chunk: Buffer) {
  res.write(chunk);
}
