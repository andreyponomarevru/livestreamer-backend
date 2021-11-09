import crypto from "crypto";

import bcrypt from "bcrypt";
import util from "util";

import * as usersDB from "../../models/user/queries";
import { logger } from "../../config/logger";
import {
  createWelcomeEmail,
  createPasswordResetEmail,
} from "../mail/email-templates";
import { NODE_ENV } from "../../config/env";
import * as mailService from "../mail/send-email";

async function confirmEmail(userId: number): Promise<void> {
  const { username, email } = await usersDB.confirmEmail(userId);
  const welcomeEmail = createWelcomeEmail({ username, email });
  logger.debug(welcomeEmail);
  if (NODE_ENV === "prod") {
    await mailService.sendEmail(welcomeEmail);
  } else {
    logger.debug(welcomeEmail);
  }
}

async function handlePasswordReset(email: string): Promise<void> {
  const token = generateToken();
  await usersDB.savePasswordResetToken({ email, token });
  const passwordResetEmail = createPasswordResetEmail({ email, token });
  logger.debug(`${__filename}: ${util.inspect(passwordResetEmail)}`);
  if (NODE_ENV === "prod") {
    await mailService.sendEmail(passwordResetEmail);
  } else {
    logger.debug(passwordResetEmail);
  }
}

async function hashPassword(
  password: string,
  saltRounds = 10,
): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

async function isPasswordMatch(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error(`${__filename}: ${err}`);
    return false;
  }
}

function generateToken(size = 64): string {
  return crypto.randomBytes(size).toString("hex");
}

export {
  hashPassword,
  isPasswordMatch,
  handlePasswordReset,
  confirmEmail,
  generateToken,
};
