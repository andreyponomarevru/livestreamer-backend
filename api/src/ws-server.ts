//
// WebSocket Server
//
// (completely independent of HTTP Server)
//
import util from "util";

import WebSocket, { Server } from "ws";

import { Request } from "express";
import { logger } from "./config/logger";
import { clientStore } from "./services/chat/ws-client-store";
import { WSUserMsg, WSSysMsg, ExposedWSClient } from "./types";
import { serverOptions } from "./config/ws-server";
import inoutStream from "./services/stream/inout-stream";

class WSServer extends Server {
  constructor(options?: WebSocket.ServerOptions) {
    super(options);
  }

  send<Data>(msg: WSSysMsg<Data> | WSUserMsg<Data>, toClientId: number): void {
    const client = clientStore.getClient(toClientId);

    if (client) {
      client.socket.send(JSON.stringify(msg));
      logger.info(
        `${__filename}: [send] To ${client.username}: ${util.inspect(msg)}`,
      );
    } else {
      logger.error(`${__filename} [send] Client doesn't exist`);
    }
  }

  sendToAll<Data>(msg: WSSysMsg<Data> | WSUserMsg<Data>): void {
    logger.info(`${__filename}: [sendToAll] ${util.inspect(msg)}`);
    for (const [id, wsClient] of clientStore.getAllClients()) {
      wsClient.socket.send(JSON.stringify(msg));
    }
  }

  sendToAllExceptSender<Data>(
    msg: WSSysMsg<Data> | WSUserMsg<Data>,
    senderId: number,
  ): void {
    for (const [id, wsClient] of clientStore.getAllClients()) {
      if (id !== senderId) wsClient.socket.send(msg);
    }
  }
}

//
// WebSocket Server event handlers
//

function onConnection(newSocket: WebSocket, req: Request) {
  // TODO: when new user connect we have to send him a bunch of data that will sinchornyze him with already connected users. Here are the piecies of data we need to send him on connection:
  // - list of all connected users // get from wsStore
  //   update users cpunter (send it to client) only when new user conects, send all clients this:
  // { event: "adduser", data: { newUser: { username, .. }, totalUsers: 4 }}
  // - current clients count // get from wsSrore
  // - stream status (online/offline) // get from inoutStream
  // - when the stream started (`started_at` in UTC) // ?? — emit event in Model
  // - broadcast likes counter // ?? — get from http req > save in db > emit event in model. This data should also be updates every 30sec
  //
  // Idea: on connection, here, get all necessary data from db and cache it in Redis (not in session, because there will be unauthenticeted users), justin a key 'broadcast:live'. Then in other places you can access it as redis["broadcast:live"].likesCount/startedAt

  const userId = req.session.authenticatedUser!.id;
  const username = req.session.authenticatedUser!.username;

  // TODO: probbly you need to edit code in onUpgrade function, to alow unauthenticated users to be added to clientStore too. Just don't let them to send messages

  clientStore.addClient({ id: userId, username: username, socket: newSocket });

  const msg: WSSysMsg<ExposedWSClient[]> = {
    event: "chat:connectedclients",
    data: clientStore.sanitizedClients,
  };
  wsServer.send(msg, userId);

  inoutStream.isPaused()
    ? wsServer.send({ event: "stream:offline" }, userId)
    : wsServer.send({ event: "stream:online" }, userId);

  newSocket.on("message", (inboundMsg) => {
    logger.debug(
      `Inbound message ${util.inspect(
        inboundMsg.toString(),
      )} from: ${username}`,
    );
  });
}

function onClose() {
  logger.info(`${__filename}: WebSocket Server closed, bye.`);
}

//

export const wsServer = new WSServer(serverOptions);
wsServer.on("connection", onConnection);
wsServer.on("close", onClose);
