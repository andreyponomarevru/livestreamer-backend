import EventEmitter from "events";

import { STATS_MSG_TIME_INTERVAL } from "../../config/ws-server";
import { DeletedWSClient, SanitizedWSChatClient, WSClient } from "../../types";
import { Scheduler } from "./scheduler";
import { logger } from "../../config/logger";
import { sanitizeWSClient } from "./sanitize-ws-client";

class WSClientStore extends EventEmitter {
  private _clients: Map<string, WSClient>;
  private statsUpdatesScheduler: Scheduler;

  constructor(statsUpdatesScheduler: Scheduler) {
    super();
    this._clients = new Map();
    this.statsUpdatesScheduler = statsUpdatesScheduler;
  }

  addClient(client: WSClient): void {
    this._clients.set(client.uuid, client);

    this.scheduleStatsUpdates();

    if (client) {
      this.emit("add_client", {
        client: sanitizeWSClient(client),
      });
      console.log(`${__filename} new WS client is added`);
    }
  }

  deleteClient(uuid: string): void {
    const client = this._clients.get(uuid);

    if (!client) return;

    this._clients.delete(uuid);
    this.emit("delete_client", {
      uuid,
      id: client.id,
      username: client.username,
    } as DeletedWSClient);

    // To avoid memory leak, when all users left the chat, delete the timer.
    if (this._clients.size === 0) {
      this.statsUpdatesScheduler.stop();
    }

    console.log(`${__filename} WS client deleted`);
  }

  private scheduleStatsUpdates(): void {
    console.log(
      `${__filename} [scheduleStatsUpdates function], clientCount: ${this.clientCount}`,
    );
    // To avoid memory leaks, start timer only when the very first client connects. We will reuse this timer for all other clients, instead of creating a new timer per client.
    if (this.clientCount === 1 && !this.statsUpdatesScheduler.timerId) {
      console.log(`${__filename} Start Scheduler`);
      this.statsUpdatesScheduler.start(() => {
        this.emit("update_client_count", this.clientCount);
        console.log(
          `${__filename} =========== [update_client_count] ${this.clientCount}`,
        );
      }, STATS_MSG_TIME_INTERVAL);
    }
  }

  get clientCount(): number {
    return this._clients.size;
  }

  get clients(): WSClient[] {
    return Array.from(this._clients, ([uuid, client]) => client);
  }

  get sanitizedClients(): SanitizedWSChatClient[] {
    return Array.from(this._clients, ([uuid, client]) =>
      sanitizeWSClient(client),
    );
  }

  getClient(uuid: string): WSClient | undefined {
    return this._clients.get(uuid);
  }
}

export { WSClientStore };
