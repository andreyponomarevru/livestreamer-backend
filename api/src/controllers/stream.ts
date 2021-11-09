import { Request, Response, NextFunction } from "express";
import fs from "fs";

import { logger } from "../config/logger";
import { HttpError } from "../utils/http-error";
import { showReadableStreamMode } from "../utils/log";
import * as streamService from "../services/stream/stream";
import * as websocketService from "../services/ws/ws";

async function onReqData(chunk: Buffer) {
  /*showReadableStreamMode(
    streamService.inoutStream,
    "broadcaster's push stream",
  );*/

  // Push incoming request data into Readable stream in order to be able to consume it later on listener-client request (it doesn't accumulates in memory, it is just lost)
  streamService.inoutStream.push(chunk);
}

async function onClose() {
  logger.debug(
    `${__filename} [close] Broadcasting client has closed the request (push audio stream).`,
  );
  await streamService.endBroadcast();

  // We shouldn't use 'close' and/or 'end' methods on the read/write streams of our duplex stream, otherwise the broadcast-client won't be able to reconnect and start pushing again until the server restart. 'pause' is the most appropriate alternative to these methods
  streamService.inoutStream.pause();
  showReadableStreamMode(
    streamService.inoutStream,
    "broadcaster's push stream",
  );
}

function onEnd() {
  logger.debug(`${__filename} [end] No more data in request stream.`);
  showReadableStreamMode(
    streamService.inoutStream,
    "broadcaster's push stream",
  );
}

async function onErr(err: Error) {
  logger.error(`${__filename} [error] ${err}`);
  showReadableStreamMode(
    streamService.inoutStream,
    "broadcaster's push stream",
  );
  await streamService.endBroadcast();
}

export async function push(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  websocketService.clientStore.on(
    "update_client_count",
    streamService.updateListenerPeakCount,
  );
  streamService.inoutStream.once("pause", () => {
    websocketService.clientStore.removeListener(
      "update_client_count",
      streamService.updateListenerPeakCount,
    );
  });

  try {
    await streamService.startBroadcast({
      listenersNow: websocketService.clientStore.clientCount,
    });

    logger.debug(`${__filename} Starting push stream from client to server...`);
    // When broadcast-client connects, switch the stream back into the 'flowing' mode, otherwise later we won't be able to push data to listener-clients requests
    streamService.inoutStream.resume();

    req.on("data", onReqData);
    req.on("error", onErr);
    req.on("end", onEnd);
    req.on("close", onClose);
  } catch (err) {
    next(err);
  }
}

// By default, new readable streams are set to the 'paused' mode. But when we add 'data' event handler or use `pipe`, we auto set readable stream into 'flowing' mode. So, when there are no listeners (hence no 'pipe' method is attached to stream), the stream will switch back to pause mode (although broadcaster may still continue to stream). We don't want that to happen, so to set the stream to flowing mode from the ground up, we pipe it to nowhere. It doesn't matter where to pipe, as long as the 'pipe' method is used, because as I've already mentioned, we use 'pipe' only to set the stream into 'flowing' mode and don't care where it will send the data
streamService.inoutStream.pipe(fs.createWriteStream("\\\\.\\NUL"));
// Pause the stream on app startup because initially there is no broadcaster, so there is nothing to stream. Without pausing, clients trying to connect won't recieve 404, the request will just hang without response
streamService.inoutStream.pause();

export function pull(req: Request, res: Response, next: NextFunction): void {
  logger.debug(
    "[data] event listeners: ",
    streamService.inoutStream.listeners("data"),
  ); // added below by 'pipe' method
  logger.debug(
    "[pause] event listeners: ",
    streamService.inoutStream.listeners("pause"),
  ); // added below manually

  // Before doing anything further, check whether the broadcaster-client is actually streaming.
  // If the stream is in the flowing mode, that means the broadcast-client is streaming, hence we're able to send the stream to listener-clients and we set response code to 200. Next, the 'data' event handler will be triggered starting sending the stream.
  // If the stream is paused, it means the broadcaster doesn't stream.

  if (streamService.inoutStream.readableFlowing) {
    res.writeHead(200, {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      connection: "keep-alive",
      "cache-control": "no-cache, no-store, must-revalidate",
      pragma: "no-cache",
      expires: 0,
    });

    /// 'pipe' automatically switches the stream back into the 'flowing' mode
    streamService.inoutStream.pipe(res);
    streamService.inoutStream.on("pause", res.end);
    req.on("close", () => {
      streamService.inoutStream.removeListener("pause", res.end);
    });
  } else {
    next(
      new HttpError({
        code: 404,
        message: "The requested page does not exist",
      }),
    );
  }
}
