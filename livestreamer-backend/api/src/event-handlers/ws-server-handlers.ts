import { logger } from "./../config/logger";
import * as streamService from "./../services/stream/stream";
import { clientStore } from "../services/ws/ws";
import { WSClient } from "../types";
import {
  sendBroadcastState,
  sendClientCount,
  sendClientsList,
} from "./services-handlers";

//
// WS Server (socket) events
//

async function onConnection(client: WSClient): Promise<void> {
  client.socket.on("close", () => clientStore.deleteClient(client.uuid));
  sendBroadcastState(client, await streamService.readBroadcastState());
  clientStore.addClient(client);
  sendClientsList(client, clientStore.sanitizedClients);
  sendClientCount(client, clientStore.clientCount);
}

function onClose(): void {
  logger.info(`${__filename}: WebSocket Server closed, bye.`);
}

export { onClose, onConnection };
