import { spawn } from "child_process";

import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";

import { FFMPEG_ARGS } from "./config";
import { startStream } from "./http-client";
import { onUncaughtException, onUnhandledRejection } from "./process-handlers";
import { signIn, signOut } from "./http-client";

async function start() {
  const child = spawn("ffmpeg", FFMPEG_ARGS);
  // Without piping to process.stderr, ffmpeg silently hangs
  // after a few minutes
  child.stderr.pipe(process.stderr);

  //

  await signIn();
  const httpReq = await startStream();
  process.on("SIGINT", async () => {
    httpReq.end();
    console.log("Broadcast is finished.\nConnections has been closed.");
    await signOut();
    process.exit(0);
  });
  // intercept Ctrl+C
  process.on("uncaughtException", async () => {
    httpReq.end();
    console.error("Broadcast is finished.\nConnections has been closed.");
    await signOut();
    process.exit(1);
  });

  // Pass audio stream into request stream
  child.stdout.pipe(httpReq);

  // Write readable to disk i.e. push data into writable stream to save audio
  const writableStream = fs.createWriteStream(`./recordings/${uuidv4()}.wav`);
  child.stdout.pipe(writableStream);
}

process.on("uncaughtException", onUncaughtException);
process.on("uncaughtException", signOut);
process.on("unhandledRejection", onUnhandledRejection);
process.on("unhandledRejection", signOut);

start().catch(console.log);
