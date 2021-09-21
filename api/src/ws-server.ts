//
// WebSocket Server
//
// (completely independent of HTTP Server)
//
import { IncomingMessage } from "http";
import util from "util";

import WebSocket, { Server } from "ws";
import { v4 as uuidv4 } from "uuid";

import { logger } from "./config/logger";
import { WS_ALLOWED_EVENTS } from "./config/ws-server";
import { WSClientsStore } from "./services/chat/ws-client-store";
import { serverOptions } from "./config/ws-server";
import { inoutStream } from "./services/stream/stream";
import {
  WSUserMsg,
  Broadcast,
  AuthNtedClient,
  WSSysMsg,
  SanitizedWSClient,
  WSMsgPayload,
} from "./types";
import broadcastEvents from "./services/broadcast/broadcast-events";
import chatEvents from "./services/chat/chat-events";
import streamEvents from "./services/stream/stream-events";
import { WSClientStoreStats } from "./services/chat/ws-client-store";

class WSServer extends Server {
  constructor(options?: WebSocket.ServerOptions) {
    super(options);
  }

  send<Data>(msg: WSSysMsg<Data> | WSUserMsg<Data>, toClientUUID: string) {
    logger.info(`${__filename}: send to ${toClientUUID}: ${util.inspect(msg)}`);
    clientStore.clients[toClientUUID].socket.send(JSON.stringify(msg));
  }

  sendToAll<Data>(msg: WSSysMsg<Data> | WSUserMsg<Data>) {
    logger.info(`${__filename}: sendToAll: ${util.inspect(msg)}`);
    for (const id in clientStore.clients) {
      clientStore.clients[id].socket.send(JSON.stringify(msg));
    }
  }

  // TODO: when you will call this functin from other places in code, user senderId retrieved from Redis Session
  sendToAllExceptSender<Data>(
    msg: WSSysMsg<Data> | WSUserMsg<Data>,
    senderClientUUID: string,
  ) {
    for (const id in clientStore.clients) {
      if (id !== senderClientUUID) {
        clientStore.clients[id].socket.send(msg);
      }
    }
  }
}

//
// WebSocket Server event handlers
//

function onConnection(
  newSocket: WebSocket,
  req: IncomingMessage,
  client: AuthNtedClient,
) {
  // `req` is the http GET request sent by the client. Useful for parsing authority headers, cookie headers, and other information. But you've probably done it already before this function is executed

  const newClient = { id: 0, username: "from DB", socket: newSocket };
  const msg: WSSysMsg<SanitizedWSClient[]> = {
    event: "chat:connectedclients",
    data: clientStore.sanitizedClients,
  };

  const clientUUID = clientStore.addClient(newClient);
  wsServer.send(msg, clientUUID);
  inoutStream.isPaused()
    ? wsServer.send({ event: "stream:offline" }, clientUUID)
    : wsServer.send({ event: "stream:online" }, clientUUID);

  newSocket.on("message", (inboundMsg) => {
    logger.debug(
      `Inbound message ${util.inspect(inboundMsg.toString())} from: ${client}`,
    );
  });
  newSocket.on("close", (socket: WebSocket) => {
    // TODO: this function causes an error because you need to pass real id/uuid/etc
    // clientStore.deleteClient(clientUUID);
  });
}
function onClose(clientUUID: string) {
  logger.debug(`${__filename}: WebSocket Server is closing. Bye.`);
}

//
// Service event handlers
//

// WS Client Store event handlers

function onUpdateStats(stats: WSClientStoreStats) {
  const { clientCount, peakClientCount } = stats;
  const counters = { clientCount, peakClientCount, broadcastLikeCount: 0 };
  wsServer.sendToAll({ event: "broadcast:updatestats", data: counters });
}
function onAddClient(clientUUID: string) {
  wsServer.sendToAll({
    event: "chat:addclient",
    data: clientStore.getSanitizedClient(clientUUID),
  });
}
function onDeleteClient(clientUUID: string) {
  wsServer.sendToAll({
    event: "chat:deleteclient",
    data: clientStore.getSanitizedClient(clientUUID),
  });
}

// Other service event handlers

function onStreamStart(newBroadcast: Broadcast) {
  wsServer.sendToAll({ event: "stream:online", data: newBroadcast });
}
function onStreamEnd() {
  wsServer.sendToAll({ event: "stream:offline" });
}

function onCreateChatComment(comment: any) {
  wsServer.sendToAll({ event: "chat:createcomment", data: comment });
}
function onDestroyChatComment(commentId: any) {
  wsServer.sendToAll({ event: "chat:deletecomment", data: commentId });
}
function onLikeChatComment(commentId: any) {
  wsServer.sendToAll({ event: "chat:likecomment", data: commentId });
}
function onUnlikeChatComment(commentId: any) {
  wsServer.sendToAll({ event: "chat:unlikecomment", data: commentId });
}

function onBroadcastStreamLike(likeCount: any) {
  wsServer.sendToAll({ event: "broadcast:like", data: likeCount });
}

//

const wsServer = new WSServer(serverOptions);
wsServer.on("connection", onConnection);
wsServer.on("close", onClose);

const clientStore = new WSClientsStore();
clientStore.on("addclient", onAddClient);
clientStore.on("deleteclient", onDeleteClient);
clientStore.on("updatestats", onUpdateStats);

streamEvents.on("start", onStreamStart);
streamEvents.on("end", onStreamEnd);
chatEvents.on("createcomment", onCreateChatComment);
chatEvents.on("deletecomment", onDestroyChatComment);
chatEvents.on("likecomment", onLikeChatComment);
chatEvents.on("unlikecomment", onUnlikeChatComment);
broadcastEvents.on("like", onBroadcastStreamLike);

export { wsServer };
