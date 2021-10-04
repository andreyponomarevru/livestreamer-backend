import util from "util";
import EventEmitter from "events";

import { v4 as uuidv4 } from "uuid";

import WebSocket from "ws";
import { logger } from "../../config/logger";
import { STATS_MSG_TIME_INTERVAL } from "../../config/ws-server";
import { WSClient } from "../../types";
import { buildUsername } from "./../../utils/utils";
import { ExposedWSClient, WSClientStoreStats } from "../../types";
import { wsServer } from "../../ws-server";

export class WSClientsStore extends EventEmitter {
  private clientPeakCount: number;
  private clients: Map<number, WSClient>;
  private timerId?: NodeJS.Timer;

  constructor() {
    super();

    this.clients = new Map();
    this.clientPeakCount = 0;
  }

  addClient({ id, username, socket }: WSClient): number {
    // TODO: we need to add to store unauthenticated cients as welll, hence to identify them we will need to use uuidv4() IDs insteead of db IDs from postgres used for authenticated clients. So, rewrite this function to accomodate for unauthenticated users

    // TODO: maybe in future we will allow anon users in chat, so we will need uuids. For now — only authenticated users are allowed to connect over WS
    // const clientUUID = uuidv4();
    // if (!username) username = buildUsername(clientUUID);

    socket.on("close", () => this.deleteClient(id));

    this.clients.set(id, { id, socket, username });

    this.emit("addclient", this.getSanitizedClient(id));
    this.updatePeakClientCount();
    this.emit("updatestats", this.stats);
    this.scheduleStatsUpdates();

    logger.debug(`${__filename}: ${username} added to client store`);
    logger.debug(
      `${__filename}: clients in store: ${util.inspect(this.clients)}`,
    );

    return id;
  }

  deleteClient(id: number): void {
    const client = this.clients.get(id);

    if (!client) {
      logger.error(
        `${__filename} [deleteClient] Can't delete a client which is not in client store`,
      );
      return;
    }

    this.clients.delete(id);
    this.emit("deleteclient", client.username);

    logger.debug(
      `${__filename}: clients in store: ${util.inspect(this.clients)}`,
    );

    // To avoid memory leak, when all users left the chat, delete the timer.
    if (this.clients.size === 0) {
      logger.debug(`timer with timerId ${this.timerId} has been cleared.`);
      clearInterval(this.timerId as NodeJS.Timer);
    }
  }

  scheduleStatsUpdates(): void {
    // To avoid memory leaks, start timer only when the very first client connects. We will reuse this timer for all other clients, instead of creating a new timer per client.
    if (this.clients.size === 1 && !this.timerId) {
      this.timerId = setInterval(() => {
        this.emit("updatestats", this.stats);
      }, STATS_MSG_TIME_INTERVAL);
    }
  }

  private get stats(): WSClientStoreStats {
    return {
      clientCount: this.clients.size,
      clientPeakCount: this.clientPeakCount,
    };
  }

  getAllClients() {
    return this.clients;
  }

  get sanitizedClients(): ExposedWSClient[] {
    const clients = [];
    for (const [key, wsClient] of this.clients) {
      clients.push({
        id: wsClient.id,
        username: wsClient.username,
      });
    }
    return clients;
  }

  getClient(id: number) {
    return this.clients.get(id);
  }

  getSanitizedClient(id: number): ExposedWSClient | undefined {
    const client = this.clients.get(id);
    if (client) {
      return { id, username: client.username };
    } else {
      logger.error(`${__filename} [getSanitizedClient] Client doesn't exit`);
      return;
    }
  }

  private updatePeakClientCount(): void {
    if (this.clients.size > this.clientPeakCount) {
      this.clientPeakCount = this.clients.size;
    }
  }
}

// WS Client Store event handlers

export function onUpdateStats(stats: WSClientStoreStats): void {
  const { clientCount, clientPeakCount } = stats;
  const counters = { clientCount, clientPeakCount, broadcastLikeCount: 0 };
  wsServer.sendToAll({ event: "chat:updatestats", data: counters });
}
export function onAddClient(client: ExposedWSClient): void {
  wsServer.sendToAll({
    event: "chat:addclient",
    data: client,
  });
}
export function onDeleteClient(username: string): void {
  wsServer.sendToAll({
    event: "chat:deleteclient",
    data: username,
  });
}

//

export const clientStore = new WSClientsStore();
clientStore.on("addclient", onAddClient);
clientStore.on("deleteclient", onDeleteClient);
clientStore.on("updatestats", onUpdateStats);
