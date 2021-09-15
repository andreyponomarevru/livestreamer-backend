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
import { AuthNtedClient, WSSysMsg } from "./types";
import { WSClientsStore } from "./services/chat/ws-client-store";
import { serverOptions } from "./config/ws-server";
import { inoutStream } from "./services/stream/stream";
import { WSUserMsg, WSClientStoreStats } from "./types";

class MyServer extends Server {
  public clientStore: WSClientsStore;

  constructor(options?: WebSocket.ServerOptions) {
    super(options);

    this.on("connection", this.onConnection.bind(this));

    this.clientStore = new WSClientsStore();
    this.clientStore.on("addclient", this.onAddClient.bind(this));
    this.clientStore.on("deleteclient", this.onDeleteClient.bind(this));
    this.clientStore.on("updatestats", this.onUpdateStats.bind(this));
  }

  sendToAll(msg: WSSysMsg | WSUserMsg) {
    logger.info(`${__filename}: sendToAll: ${util.inspect(msg)}`);
    for (const id in this.clientStore.clients) {
      this.clientStore.clients[id].socket.send(JSON.stringify(msg));
    }
  }

  send(msg: WSSysMsg | WSUserMsg, toClientUUID: string) {
    logger.info(`${__filename}: send to ${toClientUUID}: ${util.inspect(msg)}`);
    this.clientStore.clients[toClientUUID].socket.send(JSON.stringify(msg));
  }

  // TODO: when you will call this functin from other places in code, user senderId retrieved from Redis Session
  sendToAllExceptSender(msg: WSSysMsg | WSUserMsg, senderClientUUID: string) {
    for (const id in this.clientStore.clients) {
      if (id !== senderClientUUID) {
        this.clientStore.clients[id].socket.send(msg);
      }
    }
  }

  private onConnection(
    newSocket: WebSocket,
    req: IncomingMessage,
    client: AuthNtedClient,
  ) {
    // `req` is the http GET request sent by the client. Useful for parsing authority headers, cookie headers, and other information. But you've probably done it already before this function is executed

    const newClient = { id: 0, username: "from DB", socket: newSocket };
    const clientUUID = this.clientStore.addClient(newClient);

    const msg = {
      event: "chat:connectedclients",
      data: this.clientStore.sanitizedClients,
    };
    this.send(msg, clientUUID);

    const isStreamOnline = inoutStream.isPaused() ? ["offline"] : ["online"];
    this.send({ event: `stream:${isStreamOnline}` }, clientUUID);

    newSocket.on("message", (inboundMsg) => {
      logger.debug(`Inbound message ${inboundMsg} from user: `, client);
      this.sendToAllExceptSender(
        { event: "chat:createcomment", data: { message: inboundMsg } },
        clientUUID,
      );
    });
    newSocket.on("close", (socket: WebSocket) => this.onClose(clientUUID));
  }

  private onUpdateStats(stats: WSClientStoreStats) {
    const { clientCount, peakClientCount } = stats;
    const counters = { clientCount, peakClientCount, broadcastLikeCount: 0 };
    this.sendToAll({ event: "broadcast:updatestats", data: counters });
  }

  private onAddClient(clientUUID: string) {
    this.sendToAll({
      event: "chat:addclient",
      data: this.clientStore.getSanitizedClient(clientUUID),
    });
  }

  private onDeleteClient(clientUUID: string) {
    this.sendToAll({
      event: "chat:removeclient",
      data: this.clientStore.getSanitizedClient(clientUUID),
    });
  }

  private onClose(clientUUID: string) {
    this.clientStore.deleteClient(clientUUID);
  }

  private parseMessage(msg: WebSocket.Data) {
    const errorText = "Incorrect message format.";

    if (typeof msg !== "string") {
      logger.error(`Not a string: ${util.inspect(msg)}`);
      throw new Error(errorText);
    }

    const parsed = JSON.parse(msg);
    if (!Array.isArray(parsed) && parsed.length !== 2) {
      logger.error(`Not an array or too short array: ${util.inspect(parsed)}`);
      throw new Error(errorText);
    }

    if (!Object.values(WS_ALLOWED_EVENTS).includes(parsed[0])) {
      logger.error(`Unsupported event name: ${util.inspect(msg)}`);
      throw new Error(errorText);
    }

    return parsed;
  }
}

const wsServer = new MyServer(serverOptions);

export { wsServer };
