//
// Broadcast Client
//

import http, { ClientRequest } from "http";
import { spawn } from "child_process";

import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import { FFMPEG_ARGS } from "./config";
const CREDENTIALS = { username: "hal", password: "go(rn89" };
const API_URL = "http://localhost:5000/api/v1";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

//

function onError(err: Error) {
  console.error(`Request error: ${err}.`);
  process.exit(1);
}

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

function onResponse(res: http.IncomingMessage) {
  console.log(`${res.statusCode}\n${res.headers}`);

  res.on("data", (chunk) => console.log(chunk));
  res.on("error", (err) => {
    console.error(`Response error: ${err}`);
    process.exit(1);
  });
}

async function startStream() {
  await client.post(`${API_URL}/sessions`, CREDENTIALS, {
    jar,
    withCredentials: true,
  });

  const httpReq = http.request({
    host: "localhost",
    port: 5000,
    path: "/api/v1/stream",
    method: "PUT",
    headers: {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      cookie: await jar.getCookieString("http://localhost"),
    },
  });

  // TODO: implement logout after the stream is closed

  //

  httpReq.on("response", onResponse);
  httpReq.on("error", onError);

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

  console.log("HTTP Client is streaming... ");

  /*
  setInterval(() => {
    console.log(
      `[${new Date().toLocaleTimeString()}] Streaming audio to server...`,
    );
  }, 1000);
  */
}

startStream().catch((err) => {
  console.log(err);
});
