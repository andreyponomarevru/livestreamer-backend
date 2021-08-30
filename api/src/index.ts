//
// API Server
//

// TODO: do everything with express http server without websockets. Than
//       introduce WS
// TODO: replace built-in http server with Express running on another port
//       DO NOT merge express http server with WebSocket server, keep them
//       separate
// TODO: send stream to clients-consumers through HTTP

import http from "http";
import util from "util";
import path from "path";

import cors from "cors";
import fs from "fs-extra";
import express from "express";
import ws from "ws";
import { v4 as uuidv4 } from "uuid";
import wav from "wav";
import morganLogger from "morgan";
import { logger, morganSettings } from "./config/logger";

import { router } from "./controllers/index";
import { env } from "./config/env";
import {
  expressCustomErrorHandler,
  on404error,
} from "./controllers/middlewares/error-handlers";
import {
  onUncaughtException,
  onUnhandledRejection,
  onServerError,
} from "./event-handlers/errors";
import { onServerListening } from "./event-handlers/server-events";

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

//
// Express App
//

const expressApp = express();
expressApp.set("port", env.HTTP_PORT);

// Middleware stack
expressApp.use(morganLogger("combined", morganSettings));
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use("/", router);
expressApp.use(on404error); // if request doesn't match the routes above, pass it to 404 error handler
expressApp.use(expressCustomErrorHandler);

//
// Node.js HTTP Server
//

const httpServer = http.createServer(expressApp);

httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);

httpServer.listen(env.HTTP_PORT);

export { httpServer };
