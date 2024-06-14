import util from "util";

import { WSClientStore } from "./ws-client-store";
import { logger } from "./../../config/logger";
import { IntervalScheduler } from "./scheduler";
import { WSClient, WSMsg, WSUserMsg } from "./../../types";

type Message<Data> = WSMsg | WSUserMsg<Data>;

export function send<Data>(msg: Message<Data>, reciever: WSClient): void {
  reciever.socket.send(JSON.stringify(msg));
  logger.info(
    `${__filename}: [send] To ${reciever.username}: ${util.inspect(msg)}`,
  );
}

export function sendToAll<Data>(
  msg: WSMsg | WSUserMsg<Data>,
  recievers: WSClient[],
): void {
  for (const client of recievers) {
    client.socket.send(JSON.stringify(msg));
  }
}

// TODO: too complex function signature, simplify it. Maybe move some functionality to separate function to decrease the number of arguments and the voerall complexity.
export function sendToAllExceptSender<Data>(
  msg: Message<Data>,
  { senderUUID }: { senderUUID: string },
  recievers: WSClient[],
): void {
  for (const client of recievers) {
    if (senderUUID !== client.uuid) {
      client.socket.send(JSON.stringify(msg));
    }
  }
}

export const clientStore = new WSClientStore(new IntervalScheduler());
