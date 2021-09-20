//
// Broadcast Client
//

import http, { ClientRequest } from "http";
import { spawn } from "child_process";

import { httpReq } from "./http-client";
import { FFMPEG_ARGS, REQUEST_OPTIONS } from "./config";

function onProcessExit(
  exitCode: number,
  httpReq: ClientRequest,
  wsClient?: WebSocket,
) {
  // wsClient?.close(1000, "Streaming is finished. Goodbye, App Server!");
  httpReq.end();
  console.log(
    "Streaming is finished.\nS connections has been closed.\nHTTP request ended.\n",
  );

  process.exit(exitCode);
}

// intercept Ctrl+C
process.on("SIGINT", () => onProcessExit(0, httpReq));
process.on("uncaughtException", () => onProcessExit(1, httpReq));

const child = spawn("ffmpeg", FFMPEG_ARGS);
// NOTE: without piping to process.stderr, ffmpeg silently hangs
// after a few minutes
child.stderr.pipe(process.stderr);
// Push audio stream to App Server in regular WS messages
// child.stdout.pipe(duplexAudioStream);
// Pass audio stream into request stream
child.stdout.pipe(httpReq);

// TODO: implement authentication. superagent can save cookies: https://stackoverflow.com/questions/11919737/how-can-you-use-cookies-with-superagent
// import superagent from "superagent";

console.log(
  `HTTP Client is streaming audio to ${REQUEST_OPTIONS.host}:${REQUEST_OPTIONS.port}\n`,
);
