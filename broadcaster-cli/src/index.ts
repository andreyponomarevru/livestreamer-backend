//
// Broadcaster (client-producer)
//

import { spawn } from "child_process";
import http from "http";

import superagent from "superagent";

// TODO: implement authentication. superagent can save cookies: https://stackoverflow.com/questions/11919737/how-can-you-use-cookies-with-superagent

const reqOptions = {
  host: "localhost",
  port: 5000,
  path: "/stream",
  method: "POST",
  headers: {
    "content-type": "audio/mpeg",
    "transfer-encoding": "chunked",
  },
};

function onResponse(res: http.IncomingMessage) {
  console.log(`${res.statusCode}\n${res.headers}`);

  res.on("data", (chunk) => console.log(chunk));
  res.on("error", (err) => {
    console.log(`Response error: ${err}`);
    process.exit(1);
  });
}

function onError(err: Error) {
  console.log(`Request error: ${err}`);
}

function onProcessExit(this: http.ClientRequest) {
  this.end();
  console.log("Request ended.");
  process.exit(0);
}

const child = spawn("ffmpeg", [
  "-f", // capture OS audio output (from pulseaudio)
  "pulse",
  "-i", // input device "default"
  "default",
  "-f", // output in .mp3
  "mp3",
  "-b:a", // set bitrate
  "192k", // ":a" means "for audio"
  "pipe:1", // pipe instead of saving to disk
]);

//

const req = http.request(reqOptions);

req.on("response", onResponse);
req.on("error", onError);
process.on("SIGINT", onProcessExit.bind(req)); // intercept Ctrl+C
process.on("uncaughtException", onProcessExit.bind(req));
// NOTE: without piping to process.stderr,
// ffmpeg will silently hang after a few minutes
child.stderr.pipe(process.stderr);
// Pass audio stream into request stream
child.stdout.pipe(req);

console.log(
  `HTTP Client is streaming audio to ${reqOptions.host}:${reqOptions.port}\n`,
);
