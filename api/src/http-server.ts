import { Socket } from "net";
import http from "http";

import { Request, Response } from "express";
import { logger } from "./config/logger";
import { HTTP_PORT } from "./config/env";
import { expressApp, sessionParser } from "./express-app";
import { wsServer } from "./ws-server";

export function onServerListening(): void {
  logger.debug(
    `${__filename}: API HTTP Server is listening on port ${HTTP_PORT}`,
  );
}

export function onServerError(err: NodeJS.ErrnoException): void | never {
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

// For example of WebSocket authentication using express-session, refer to
// https://github.com/websockets/ws#client-authentication (just a basic idea)
// https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js — this is what i've based my code on
export async function onServerUpgrade(
  req: Request,
  socket: Socket,
  head: Buffer,
): Promise<void> {
  logger.debug("WS Server parsing session from request...");

  sessionParser(req, {} as Response, () => {
    if (!req.session.authenticatedUser) {
      logger.error("WS Server [upgrade] User authentication failed.");
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    logger.debug("WS Server: user successfully authenticated.");

    wsServer.handleUpgrade(req, socket, head, (newSocket) => {
      wsServer.emit("connection", newSocket, req);
    });
  });
}

export const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);
