import WebSocket from "ws";

import { APP_SERVER_URL } from "./config";

function onConnectionOpen(wsClient: WebSocket) {
  console.log("**************************************");
  console.log(
    `WebSocket Client has successfully connected to App Server at ${APP_SERVER_URL} and is streaming audio...`,
  );
  console.log("***************************************");
}

function onMessage(msg: WebSocket.Data) {
  console.log("************************************");
  console.log(`Incoming message: ${msg.toString()}`);
  console.log("************************************");
}

function onError(err: Error) {
  console.error(err);
  process.exit(1);
}

export { onConnectionOpen, onMessage, onError };
