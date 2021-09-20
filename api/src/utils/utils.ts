import crypto from "crypto";
import { Readable, Duplex } from "stream";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import { WSSysMsg, WSUserMsg } from "../types";

export function showReadableStreamMode(
  stream: Readable | Duplex,
  streamName: string,
): void {
  const mode = stream.isPaused()
    ? `${streamName} PAUSED`
    : `${streamName} FLOWING`;
  console.log(mode);
}

export function buildUsername(string: string) {
  const clientUUID = uuidv4();
  return clientUUID.substr(0, 8);
}

export async function hashPassword(password: string, saltRounds = 10) {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

export function generateEmailConfirmationToken(size = 64) {
  return crypto.randomBytes(size).toString("hex");
}
