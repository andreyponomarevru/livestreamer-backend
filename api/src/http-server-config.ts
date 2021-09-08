//
// REST API Server
//

import express from "express";
import http, { IncomingMessage } from "http";
import path from "path";
import url from "url";
import { Socket } from "net";

import WebSocket from "ws";
import morganLogger from "morgan";
import { logger, morganSettings } from "./config/logger";
import cors from "cors";

import {
  expressCustomErrorHandler,
  on404error,
} from "./controllers/middlewares/error-handlers";
import { onServerError } from "./event-handlers/error-handlers";
import { router } from "./controllers/index";
import { HTTP_PORT } from "./config/env";
import * as wsInfoServer from "./ws-info-server-config";
import * as wsStreamingServer from "./ws-streaming-server-config";
import { onServerListening } from "./event-handlers/server-events";

// Route WS requests
function upgrade(req: IncomingMessage, socket: Socket, head: Buffer) {
  const { pathname } = url.parse(req.url || "");

  switch (pathname) {
    /*
		case "/info": {
      // TODO: authenticate(...). Refer for Cookie auth example https://github.com/websockets/ws#client-authentication
      console.log("WS Messaging Server: perform AuthN");
      wsInfoServer.server.handleUpgrade(
        req,
        socket,
        head,
        wsInfoServer.handleAfterUpgrade,
      );
      break;
    }*/
    case "/stream": {
      wsStreamingServer.server.handleUpgrade(
        req,
        socket,
        head,
        wsStreamingServer.handleAfterUpgrade,
      );
      break;
    }
    default:
      socket.destroy();
  }
}

// Express App

const expressApp = express();
expressApp.set("port", HTTP_PORT);

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
httpServer.on("upgrade", upgrade);

export { httpServer };
