//
// WS Audio Streaming Server
//
// (completely independent of HTTP Server)
//

import http from "http";
import { Socket } from "net";
import { Duplex } from "stream";

import WebSocket from "ws";

import { env } from "./config/env";

/*
const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    callback();
  },
  read(size) {},
});*/

const wsServer = new WebSocket.Server({ noServer: true, path: "/stream" });
let sockets: WebSocket[] = [];

function upgrade(request: http.IncomingMessage, socket: Socket, head: Buffer) {
  // TODO:
  // authenticate(...)
  // Refer for Cookie auth example https://github.com/websockets/ws#client-authentication

  console.log("Performing AuthN");

  wsServer.handleUpgrade(request, socket, head, handleUpgrade);
}

function handleUpgrade(wsClient: WebSocket, request: http.IncomingMessage) {
  console.log("handle upgrade");
  // The 'client' here should be the result of authN, refer to the code example https://github.com/websockets/ws#client-authentication
  wsServer.emit("connection", wsClient, request, {
    client: { id: 1, username: "motherfucker" },
  });
}

function broadcastToAllExceptSender(msg: WebSocket.Data, sender: WebSocket) {
  sockets.forEach((client) => {
    if (client !== sender) client.send(msg);
  });
}

function onConnection(
  socket: WebSocket,
  request: WebSocket,
  client: http.IncomingMessage,
) {
  console.log("WebSocket connection with Broadcasting Client is opened.");
  //console.log(client);
  //socket.on("message", onMessage.bind(client));
  //socket.send("Ola, client!");
  sockets.push(socket);

  socket.on("message", (msg) => {
    console.log(msg);
    broadcastToAllExceptSender(msg, socket);
  });

  /*
  socket.on("message", (msg) => {
    console.log("new message");
    console.log(msg);
    sockets.forEach((s) => {
      s.send(msg);
    });
  });*/

  socket.on("close", () => {
    sockets = sockets.filter((s) => {
      // 'socket' here is the closed socket
      if (s === socket) return false;
      else return true;
    });
    console.log("Broadcasting Client closed the connection.");
  });
}

function onMessage(this: http.IncomingMessage, message: WebSocket.Data) {
  console.log("---------", this);

  console.log("onMessage");
  console.log("Recieved msg: ");
  //console.log(message);
  console.log("from user: ", this);
  // Why 'client' is 'undefined'? It is expected behavior: https://stackoverflow.com/questions/61725169/client-undefined-in-websocket-server implement it itself

  console.log("How many clients are listening? ", sockets.length);
}

wsServer.on("connection", onConnection);

//wsServer.on("connection", onConnection);

export { upgrade };
