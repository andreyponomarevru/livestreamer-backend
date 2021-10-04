import fs from "fs-extra";
import { Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";

import { logger } from "../../config/logger";
import {
  showReadableStreamMode,
  getCurrentISOTimestampWithoutTimezone,
} from "../../utils/utils";
import inoutStream from "./inout-stream";
import { StreamError } from "./stream-error";
import { NODE_ENV, SAVED_STREAMS_DIR } from "../../config/env";
import * as broadcastService from "../broadcast/broadcast";
import { wsServer } from "../../ws-server";
import { clientStore } from "../chat/ws-client-store";
import { BroadcastDraft, WSClientStoreStats } from "../../types";

export function push(req: Request, writeTo?: string): void {
  logger.debug("Starting push stream from client to server...");

  // When broadcast-client connects, switch the stream back into the 'flowing' mode, otherwise later we won't be able to push data to listener-clients requests
  inoutStream.resume();

  req.on("data", (chunk: Buffer) => {
    // showReadableStreamMode(inoutStream, "broadcaster's push stream");

    // Push incoming request data into Readable stream in order to be able to consume it later on listener-client request (it doesn't accumulates in memory, it is just lost)
    inoutStream.push(chunk);
    // Write incoming request data to disk i.e. push data into writable stream)
    if (NODE_ENV === "production" && writeTo) {
      const writableStream = fs.createWriteStream(writeTo);
      writableStream.write(chunk);
    }
  });

  req.on("error", (err) => {
    logger.error(err);
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  });

  req.on("end", () => {
    logger.debug("end: No more data in request stream.");
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  });

  req.on("close", () => {
    logger.debug(
      "close: Broadcasting client has closed the request (push audio stream).",
    );
    // We shouldn't use 'close' and/or 'end' methods on the read/write streams of our duplex stream, otherwise the broadcast-client won't be able to reconnect and start pushing again until the server restart. 'pause' is the most appropriate alternative to these methods
    inoutStream.pause();
    showReadableStreamMode(inoutStream, "broadcaster's push stream");
  });
}

export function pull(res: Response): void {
  inoutStream.on("data", (chunk: Buffer) => {
    res.write(chunk);
  });

  inoutStream.on("pause", () => {
    logger.debug("pause: Broadcasting client has stopped the stream.");
    // When broadcasting client suddenly stops pushing the stream, we switch the stream to the paused mode (hence this event handler is invoked) — there is nothing to broadcast, hence we end the listener-client's request
    res.end();
  });

  // Before doing anything further, check whether the broadcaster-client is actually streaming.
  // If the stream is in the flowing mode, that means the broadcast-client is streaming, hence we're able to send the stream to listener-clients and we set response code to 200. Next, the 'data' event handler will be triggered starting sending the stream.
  // If the stream is paused, it means the broadcaster doesn't stream.
  if (inoutStream.isPaused()) throw new StreamError("STREAM_PAUSED");
}

//

async function onStreamStart() {
  const newBroadcast = await broadcastService.createBroadcast();
  wsServer.sendToAll({ event: "stream:online", data: newBroadcast });
  // We need to save the function returned from the 'bind' to be able to remove it later (otherwise a new event listener is added on every client req). Details: https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
  const saveBroadcastStatsRef = saveBroadcastStats.bind(newBroadcast.id);
  clientStore.on("updatestats", saveBroadcastStatsRef);
  inoutStream.once("pause", () => onStreamEnd(newBroadcast));
  inoutStream.once("pause", () => {
    clientStore.removeListener("updatestats", saveBroadcastStatsRef);
  });
}

async function onStreamEnd(newBroadcast: BroadcastDraft) {
  wsServer.sendToAll({ event: "stream:offline" });

  await broadcastService.updateHiddenBroadcast({
    id: newBroadcast.id,
    endAt: getCurrentISOTimestampWithoutTimezone(),
  });
}

async function saveBroadcastStats(
  stats: WSClientStoreStats,
  broadcastId: number,
) {
  await broadcastService.updateHiddenBroadcast({
    id: broadcastId,
    listenerPeakCount: stats.clientPeakCount,
  });
}

inoutStream.on("resume", onStreamStart);
