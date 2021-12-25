import { Socket } from "net";
import http from "http";
import util from "util";

import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { logger } from "./config/logger";
import { HTTP_PORT } from "./config/env";
import { expressApp, sessionParser } from "./express-app";
import { wsServer } from "./ws-server";
import { WSChatClient } from "./services/ws/ws-client";
import { handleUpgrade } from "./ws-server";
import * as redis from "./config/redis";

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

// For example of WebSocket authentication using express-session, refer to
// https://github.com/websockets/ws#client-authentication (just a basic idea)
// https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js — this is what i've based my code on
async function onServerUpgrade(
  req: Request,
  socket: Socket,
  head: Buffer,
): Promise<void> {
  logger.debug("WS Server parsing session from request...");

  sessionParser(req, {} as Response, () => {
    logger.debug(
      `${__filename} onServerUpgrade > sessionParser: session ID is ${req.sessionID}`,
    );
    logger.debug(
      `${__filename} onServerUpgrade > sessionParser: ${util.inspect(
        req.session,
      )}`,
    );

    if (req.session && req.session.authenticatedUser) {
      logger.info(`${__filename} [upgrade] User successfully authenticated`);

      const username = req.session.authenticatedUser.username;
      const id = req.session.authenticatedUser.id;
      const uuid = req.session.authenticatedUser!.uuid;

      wsServer.handleUpgrade(req, socket, head, (newSocket) => {
        handleUpgrade(
          new WSChatClient({
            uuid,
            id,
            username,
            socket: newSocket,
          }),
        );
      });
    } else {
      logger.info(`${__filename}: [upgrade] User is not authenticated.`);
      // Add unauthenticated users to the store too, to be able to track the total number of opened connections
      wsServer.handleUpgrade(req, socket, head, (newSocket) => {
        handleUpgrade(new WSChatClient({ uuid: uuidv4(), socket: newSocket }));
      });

      // Alternatively we can completely deny the access for unauthenticated users
      // socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      // socket.destroy();
      // return;
    }
  });
}

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);
// During application lifecycle after connecting to the Redis for the first time, I keep the established connection always open. But during integration testing we need to be able to open/close Redis connection between tests to keep everything clean, thus we need this handler
httpServer.on("close", redis.quit);

export { httpServer };
