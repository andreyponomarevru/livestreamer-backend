import util from "util";
import { WSClientStore } from "./ws-client-store";
import { logger } from "../../config/logger";
import { IntervalScheduler } from "./scheduler";
import { WSClient, WSMsg, WSUserMsg } from "../../types";

type Message<Data> = WSMsg | WSUserMsg<Data>;

export const wsService = {
  clientStore: new WSClientStore(new IntervalScheduler()),

  send: function <Data>(msg: Message<Data>, reciever: WSClient): void {
    reciever.socket.send(JSON.stringify(msg));
    logger.info(
      `${__filename}: [send] To ${reciever.username}: ${util.inspect(msg)}`,
    );
  },

  sendToAll: function <Data>(
    msg: WSMsg | WSUserMsg<Data>,
    recievers: WSClient[],
  ): void {
    for (const client of recievers) {
      client.socket.send(JSON.stringify(msg));
    }
  },

  sendToAllExceptSender: function <Data>(
    msg: Message<Data>,
    { senderUUID }: { senderUUID: string },
    recievers: WSClient[],
  ): void {
    for (const client of recievers) {
      if (senderUUID !== client.uuid) {
        client.socket.send(JSON.stringify(msg));
      }
    }
  },
};
