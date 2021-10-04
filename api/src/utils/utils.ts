import crypto from "crypto";
import { Readable, Duplex } from "stream";
import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcrypt";

import { logger } from "../config/logger";

import { WSSysMsg, WSUserMsg } from "../types";

export function showReadableStreamMode(
  stream: Readable | Duplex,
  streamName: string,
): void {
  const mode = stream.isPaused()
    ? `${streamName} PAUSED`
    : `${streamName} FLOWING`;

  console.log(`${mode} [${new Date().toISOString()}]`);
}

export function buildUsername(string: string) {
  const clientUUID = uuidv4();
  return clientUUID.substr(0, 8);
}

export async function hashPassword(password: string, saltRounds = 10) {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

export async function isPasswordMatch(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    logger.error(`${__filename}: ${err}`);
    return false;
  }
}

export function generateToken(size = 64) {
  return crypto.randomBytes(size).toString("hex");
}

export const asciiRegex = new RegExp("^[\x00-\x7F]+$");

export function getCurrentISOTimestampWithoutTimezone() {
  return new Date(new Date().toUTCString()).toISOString();
}

export function encodeCursor(cursor: string) {
  return Buffer.from(cursor).toString("base64");
}

export function decodeCursor(cursor?: string) {
  if (!cursor) return [];
  return Buffer.from(cursor, "base64").toString("ascii").split(",");
}
