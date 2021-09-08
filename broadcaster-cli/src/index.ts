//
// Broadcast Client
//

import { spawn } from "child_process";

import WebSocket, { createWebSocketStream } from "ws";

import { onMessage, onError, onConnectionOpen } from "./ws-client";
import { APP_SERVER_URL, FFMPEG_ARGS } from "./config";

function onProcessExit(wsClient: WebSocket, exitCode: number) {
  wsClient.close(1000, "Streaming is finished. Goodbye, App Server!");
  console.log("Streaming is finished. WS connection has been closed.");
  process.exit(exitCode);
}

function onDuplexAudioStreamError(err: Error) {
  console.error(err);
}

//

const wsClient = new WebSocket(APP_SERVER_URL);
// To stream audio over WS we need to wrap the connection in a regular
// Node's duplex stream
const duplexAudioStream = createWebSocketStream(wsClient);
duplexAudioStream.on("error", onDuplexAudioStreamError);

wsClient.on("message", onMessage);
wsClient.on("error", onError);
wsClient.once("open", () => onConnectionOpen(wsClient));

process.on("SIGINT", () => onProcessExit(wsClient, 0)); // intercept Ctrl+C
process.on("uncaughtException", () => onProcessExit(wsClient, 1));

const child = spawn("ffmpeg", FFMPEG_ARGS);
// NOTE: without piping to process.stderr, ffmpeg silently hangs
// after a few minutes
child.stderr.pipe(process.stderr);
// Push audio stream to App Server in regular WS messages
child.stdout.pipe(duplexAudioStream);

// TODO: implement authentication. superagent can save cookies: https://stackoverflow.com/questions/11919737/how-can-you-use-cookies-with-superagent
// import superagent from "superagent";
