import WebSocket, { createWebSocketStream } from "ws";

import { WS_SERVER_URL } from "./config";

function onConnectionOpen(wsClient: WebSocket) {
  console.log("**************************************");
  console.log(
    `WebSocket Client has successfully connected to WS Server at ${WS_SERVER_URL} and is streaming audio...`,
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

function onDuplexAudioStreamError(err: Error) {
  console.error(err);
}

const wsClient = new WebSocket(WS_SERVER_URL);
// To stream audio over WS we need to wrap the connection in a regular
// Node's duplex stream
const duplexAudioStream = createWebSocketStream(wsClient);
duplexAudioStream.on("error", onDuplexAudioStreamError);

wsClient.on("message", onMessage);
wsClient.on("error", onError);
wsClient.once("open", () => onConnectionOpen(wsClient));

export { wsClient };
