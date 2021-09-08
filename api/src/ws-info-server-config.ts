//
// WS Audio Streaming Server
//
// (completely independent of HTTP Server)
//

import http, { IncomingMessage } from "http";
import { Socket } from "net";

import WebSocket from "ws";

import { INFO_SERVER_NAME } from "./config/env";

const serverOptions = { noServer: true, path: "/info" };
const server = new WebSocket.Server(serverOptions);
let connectedSockets: WebSocket[] = [];

function handleAfterUpgrade(wsClient: WebSocket, req: http.IncomingMessage) {
  console.log(`${INFO_SERVER_NAME}: handle upgrade`);
  // The 'client' here should be the result of authN, refer to the code example https://github.com/websockets/ws#client-authentication
  const client = { id: 1, username: "motherfucker" };
  server.emit("connection", wsClient, req, client);
}

function onConnection(
  newConnectionSocket: WebSocket,
  req: WebSocket,
  client: IncomingMessage,
) {
  // `request` is the http GET request sent by the client. Useful for parsing authority headers, cookie headers, and other information. `client` is the object we added manually for auth purposes
  console.log(
    `${INFO_SERVER_NAME} WS connection with Broadcasting Client is opened.`,
  );

  connectedSockets.push(newConnectionSocket);

  newConnectionSocket.on("message", onMessage);
  newConnectionSocket.on("close", () => {
    connectedSockets = connectedSockets.filter((s) => {
      // 'socket' here is the closed socket
      if (s === newConnectionSocket) return false;
      else return true;
    });

    console.log(`${INFO_SERVER_NAME}: closed socket deleted.`);

    console.log(
      `${INFO_SERVER_NAME}: Broadcasting Client closed the connection.`,
    );
  });

  newConnectionSocket.send("Ola, client!");
}

function onMessage(this: WebSocket, msg: WebSocket.Data) {
  console.log(`${INFO_SERVER_NAME}: onMessage`);
  console.log(`${INFO_SERVER_NAME}: recieved msg: `);
  this.send("Server hears you :)");
  connectedSockets.forEach((s) => {
    s.send(msg);
  });

  //console.log(message);
  //console.log(`${SERVER_NAME} from user: `, this);
  // Why 'client' is 'undefined'? It is expected behavior: https://stackoverflow.com/questions/61725169/client-undefined-in-websocket-server implement it itself

  console.log("How many clients are listening? ", connectedSockets.length);
}

server.on("connection", onConnection);

export { server, handleAfterUpgrade };
