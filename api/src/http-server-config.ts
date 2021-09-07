//
// REST API Server
//

import express from "express";
import http from "http";
import path from "path";

import morganLogger from "morgan";
import { logger, morganSettings } from "./config/logger";
import cors from "cors";

import {
  expressCustomErrorHandler,
  on404error,
} from "./controllers/middlewares/error-handlers";
import { onServerError } from "./event-handlers/error-handlers";
import { router } from "./controllers/index";
import { env } from "./config/env";
import * as webSocketServer from "./ws-messaging-server-config";
import { onServerListening } from "./event-handlers/server-events";

// Express App

const expressApp = express();
expressApp.set("port", env.HTTP_PORT);

expressApp.use(morganLogger("combined", morganSettings));
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use("/api/v1", router);
expressApp.use(on404error); // if request doesn't match the routes above, pass it to 404 error handler
expressApp.use(expressCustomErrorHandler);

// Node.js HTTP Server

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", webSocketServer.upgrade);

export { httpServer };
