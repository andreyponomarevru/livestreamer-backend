//
// REST API Server
//

import express from "express";
import http from "http";
import path from "path";
import { Socket } from "net";

import WebSocket from "ws";
import cors from "cors";
import morganLogger from "morgan";

import { HTTP_PORT } from "./config/env";
import { logger, morganSettings } from "./config/logger";
import { handleErrors } from "./controllers/middlewares/handle-errors";
import { handle404Error } from "./controllers/middlewares/handle-404-error";
import { router } from "./controllers/index";
import {
  onServerListening,
  onServerError,
  onServerUpgrade,
} from "./event-handlers/server-handlers";

// Express App

const expressApp = express();
expressApp.set("port", HTTP_PORT);

expressApp.use(morganLogger("combined", morganSettings));
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use("/api/v1", router);
// if request doesn't match the routes above, it is past to 404 error handler
expressApp.use(handle404Error);
expressApp.use(handleErrors);

// Node.js HTTP Server

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);

export { httpServer };
