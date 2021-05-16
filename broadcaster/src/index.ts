//
// Client-producer
//

// TODO: rewrite in vanilla JS, it should be possible to run the script from CL

import { spawn } from "child_process";
import http from "http";
const postRequestOptions = {
  host: "localhost",
  port: 8080,
  path: "/",
  method: "POST",
  headers: {
    "content-type": "audio/wav",
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

// process.on("SIGINT", () => {});

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
  `Streaming audio to ${postRequestOptions.host}:${postRequestOptions.port}`,
);