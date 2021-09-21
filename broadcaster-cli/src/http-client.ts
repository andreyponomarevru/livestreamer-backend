import http from "http";

import { wsClient } from "./ws-client";
import { REQUEST_OPTIONS } from "./config";

function onResponse(res: http.IncomingMessage) {
  console.log(`${res.statusCode}\n${res.headers}`);

  res.on("data", (chunk) => console.log(chunk));
  res.on("error", (err) => {
    console.error(`Response error: ${err}`);
    process.exit(1);
  });
}

function onError(err: Error) {
  console.error(`Request error: ${err}.`);
  process.exit(1);
}

const httpReq = http.request(REQUEST_OPTIONS);

httpReq.on("response", onResponse);
httpReq.on("error", onError);

export { httpReq };
