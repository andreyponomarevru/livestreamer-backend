import { Duplex, DuplexOptions } from "stream";
import { WriteStream } from "fs";
import EventEmitter from "events";

import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

import { NODE_ENV, SAVED_STREAMS_DIR } from "../config/env";
import { logger } from "../config/logger";
import { HttpError } from "../utils/http-errors/http-error";
import { showReadableStreamMode } from "../utils/utils";
import * as broadcastService from "../services/broadcast/broadcast";
import * as chatService from "../ws-server";
import * as broadcastDB from "../models/broadcast/queries";
import * as streamService from "../services/stream/stream";
import inoutStream from "./../services/stream/inout-stream";

export async function start(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    streamService.push(req);
  } catch (err) {
    next(err);
  }
}

export async function read(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    streamService.pull(res);

    res.writeHead(200, {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      connection: "keep-alive",
      "cache-control": "no-cache, no-store, must-revalidate",
      pragma: "no-cache",
      expires: 0,
    });
  } catch (err) {
    next(err);
  }
}
