import util from "util";

import { v4 as uuidv4 } from "uuid";

import { startStream, buildRequestOptions, signOut } from "./http-client";
import { signIn } from "./http-client";
import { writeStream } from "./utils";
import { audioStream } from "./audio-process";

async function onCtrlC(): Promise<void> {
  console.error("Broadcast is finished.\nConnection has been closed.");
  process.exit(0);
}

async function onUncaughtException(err: Error): Promise<void> {
  console.error(`uncaughtException: ${err.message} \n${err.stack}\n`);
  process.exit(1);
}

async function onUnhandledRejection(
  reason: string,
  p: Promise<Error>,
): Promise<void> {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
  process.exit(1);
}

async function startBroadcast() {
  const options = await buildRequestOptions();
  startStream(options);

  setInterval(function () {
    const timestamp = new Date().toISOString();
    console.log(`Sending audio to server... ${timestamp}`);
  }, 1000);
}

async function startApp(action?: string) {
  switch (action) {
    case "log-in": {
      await signIn();
      break;
    }

    case "stream": {
      await startBroadcast();
      SAVE_STREAM = args[1] === "save" ? true : false;
      if (SAVE_STREAM) {
        const saveTo = `./recordings/${uuidv4()}.wav`;
        writeStream(audioStream.stdout, saveTo);
      }
      break;
    }

    case "log-out": {
      await signOut();
      break;
    }
    default:
      process.exit(0);
  }
}

process.on("SIGINT", onCtrlC);
process.on("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

const args = process.argv.slice(2);
const ACTION = args[0];
let SAVE_STREAM = false;

startApp(ACTION).catch(console.error);
