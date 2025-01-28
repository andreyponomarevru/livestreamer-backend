import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logger";
import { streamService, inoutStream } from "../../services/stream/service";
import { wsService } from "../../services/ws/service";
import { printReadableStreamMode } from "../../utils/print-readable-stream-mode";

export async function push(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  wsService.clientStore.on(
    "update_client_count",
    streamService.updateListenerPeakCount,
  );
  inoutStream.once("pause", () => {
    wsService.clientStore.removeListener(
      "update_client_count",
      streamService.updateListenerPeakCount,
    );
  });

  try {
    await streamService.startBroadcast({
      listenersNow: wsService.clientStore.clientCount,
    });

    logger.debug(`${__filename} Starting push stream from client to server...`);
    // When broadcast-client connects, switch the stream back into the 'flowing' mode, otherwise later we won't be able to push data to listener-clients requests
    inoutStream.resume();

    req.on("data", onReqData);
    req.on("error", onErr);
    req.on("end", onEnd);
    req.on("close", onClose);
  } catch (err) {
    next(err);
  }
}

async function onReqData(chunk: Buffer) {
  //showReadableStreamMode(
  //  streamService.inoutStream,
  //  "broadcaster's push stream",
  //);

  // Push incoming request data into Readable stream in order to be able to consume it later on listener-client request (it doesn't accumulates in memory, it is just lost)
  inoutStream.push(chunk);
}

async function onClose() {
  logger.debug(
    `${__filename} [close] Broadcasting client has closed the request (push audio stream).`,
  );
  await streamService.endBroadcast();

  // We shouldn't use 'close' and/or 'end' methods on the read/write streams of our duplex stream, otherwise the broadcast-client won't be able to reconnect and start pushing again until the server restart. 'pause' is the most appropriate alternative to these methods
  inoutStream.pause();
  printReadableStreamMode(inoutStream, "broadcaster's push stream");
}

function onEnd() {
  logger.debug(`${__filename} [end] No more data in request stream.`);
  printReadableStreamMode(inoutStream, "broadcaster's push stream");
}

async function onErr(err: Error) {
  logger.error(`${__filename} [error] ${err}`);
  printReadableStreamMode(inoutStream, "broadcaster's push stream");
  await streamService.endBroadcast();
}
