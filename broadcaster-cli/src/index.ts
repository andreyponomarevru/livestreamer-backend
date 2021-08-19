//
// Broadcaster (client-producer)
//

import { spawn } from "child_process";
import http from "http";
const postRequestOptions = {
  host: "localhost",
  port: 8080,
  path: "/stream", // or '/' ?
  method: "POST",
  headers: {
    "content-type": "audio/mpeg", // or audio/mpeg ?
    "transfer-encoding": "chunked",
  },
};

//

function onResponse(res: http.IncomingMessage) {
  console.log(res.statusCode);
  console.log(res.headers);

  res.on("data", (chunk) => {
    console.log(chunk);
  });

  res.on("error", (err) => {
    console.log(`Response error: ${err}`);
  });
}

function onRequestError(err: Error) {
  console.log(`Request error: ${err}`);
}

function onProcessExit(req: http.ClientRequest) {
  req.end();
}

function sendPostRequest(options: http.RequestOptions) {
  const req = http.request(options);
  child.stdout.pipe(req);

  req.on("response", onResponse);
  req.on("error", onRequestError);
  process.on("exit", onProcessExit.bind(req));

  child.stdout.on("end", () => {
    req.end();
    console.log("End stream");
    console.log("Streaming stopped.");
  });
}

//

const child = spawn("ffmpeg", [
  "-f", // capture OS audio output (from pulseaudio)
  "pulse",
  "-i", // input device "default"
  "default",
  "-f", // output in .wav
  "wav",
  "pipe:1", // pipe instead of saving to disk
]);

sendPostRequest(postRequestOptions);
console.log(
  `HTTP Streaming Client is running on ${postRequestOptions.host}:${postRequestOptions.port}`,
);
