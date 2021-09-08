//
// WS Messaging Server
//
// (completely independent of HTTP Server)
//

import http from "http";
import { Socket } from "net";
import { Duplex } from "stream";

import WebSocket, { createWebSocketStream } from "ws";
import { inoutStream } from "./controllers/stream";

import { STREAMING_SERVER_NAME } from "./config/env";

const serverOptions = {
  noServer: true,
  path: "/stream",
  binaryType: "arraybuffer",
};

const server = new WebSocket.Server(serverOptions);

let connectedSockets: WebSocket[] = [];

function broadcastToAllExceptSender(msg: WebSocket.Data, sender: WebSocket) {
  connectedSockets.forEach((client) => {
    if (client !== sender) client.send(msg);
  });
}

function handleAfterUpgrade(wsClient: WebSocket, req: http.IncomingMessage) {
  server.emit("connection", wsClient, req);
}

function onConnection(newConnectionSocket: WebSocket, req: WebSocket) {
  // `request` is the http GET request sent by the client. Useful for parsing authority headers, cookie headers, and other information.

  connectedSockets.push(newConnectionSocket);
  newConnectionSocket.send(`${STREAMING_SERVER_NAME}: starting streaming...`);

  newConnectionSocket.on("message", (msg) => {
    //console.log(`${STREAMING_SERVER_NAME}: `, msg);

    //connectedSockets.forEach((socket) => {
    //  socket.send(msg);
    //});

    broadcastToAllExceptSender(msg, newConnectionSocket);
  });

  newConnectionSocket.on("close", () => {
    connectedSockets = connectedSockets.filter((s) => {
      // 'socket' here is the closed socket
      if (s === newConnectionSocket) return false;
      else return true;
    });
  });
}

server.on("connection", onConnection);

export { server, handleAfterUpgrade };
