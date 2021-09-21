import util from "util";
import { IncomingMessage } from "http";
import { Socket } from "net";

import { HTTP_PORT } from "../config/env";
import { logger } from "../config/logger";
import { wsServer } from "../ws-server";

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
