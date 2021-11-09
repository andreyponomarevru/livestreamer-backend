import util from "util";

import { WSClientStore } from "./ws-client-store";
import { logger } from "./../../config/logger";
import { IntervalScheduler } from "./scheduler";
import { WSClient, WSMsg, WSUserMsg } from "./../../types";

function send<Data>(msg: WSMsg | WSUserMsg<Data>, client: WSClient): void {
  console.log(`${__filename} [send] ${msg}`);

  if (client) {
    client.socket.send(JSON.stringify(msg));
    logger.info(
      `${__filename}: [send] To ${client.username}: ${util.inspect(msg)}`,
    );
  } else {
    logger.error(`${__filename} [send] Client doesn't exist`);
  }
}

function sendToAll<Data>(
  msg: WSMsg | WSUserMsg<Data>,
  clients: WSClient[],
): void {
  for (const client of clients) {
    client.socket.send(JSON.stringify(msg));
  }
}

function sendToAllExceptSender<Data>(
  msg: WSMsg | WSUserMsg<Data>,
  { senderUUID }: { senderUUID: string },
  clients: WSClient[],
): void {
  for (const client of clients) {
    if (senderUUID && senderUUID !== client.uuid)
      client.socket.send(JSON.stringify(msg));
  }
}

const clientStore = new WSClientStore(new IntervalScheduler());

export { clientStore, send, sendToAll, sendToAllExceptSender };
