//
// REST API Server
//

import util from "util";
import http, { IncomingMessage } from "http";
import path from "path";
import { Socket } from "net";

import express from "express";
import WebSocket from "ws";
import cors from "cors";
import morganLogger from "morgan";

import { HTTP_PORT } from "./config/env";
import { logger, morganSettings } from "./config/logger";
import { handleErrors } from "./controllers/middlewares/handle-errors";
import { handle404Error } from "./controllers/middlewares/handle-404-error";
import { router } from "./controllers/index";
import { wsServer } from "./ws-server";

//
// Server Event Handlers
//

function onServerListening(): void {
  logger.debug(
    `${__filename}: API HTTP Server is listening on port ${HTTP_PORT}`,
  );
}

function onServerError(err: NodeJS.ErrnoException): void | never {
  if (err.syscall !== "listen") throw err;

  const bind =
    typeof HTTP_PORT === "string" ? `Pipe ${HTTP_PORT}` : `Port ${HTTP_PORT}`;

  // Messages for listen errors
  switch (err.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}

async function authenticate(req: IncomingMessage) {
  return { id: 1, username: "johndoe" };
}

export async function onServerUpgrade(
  req: IncomingMessage,
  socket: Socket,
  head: Buffer,
): Promise<void> {
  // This function is not defined on purpose. Implement it with your own logic.
  // TODO: Refer for Cookie auth example https://github.com/websockets/ws#client-authentication
  logger.debug("WS Server: performing AuthN...");

  try {
    const authenedClient = await authenticate(req);
    logger.debug("WS Server: user successfully authenticated.");
    wsServer.handleUpgrade(req, socket, head, function (newSocket, request) {
      wsServer.emit("connection", newSocket, request, authenedClient);
    });
  } catch (err) {
    logger.error(util.inspect(err));
    logger.error("WS Server: user authentication failed.");
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
}

//
// Express App
//

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

//
// Node.js HTTP Server
//

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);

export { httpServer };
