import util from "util";

import * as userDB from "../../models/user-profile/queries";
import { logger } from "../../config/logger";
import { hashPassword, generateToken } from "../../utils/utils";
import { sendEmail } from "./send-email";
import {
  createWelcomeEmail,
  createConfirmationEmail,
  createResetPasswordEmail,
} from "./email-templates";
import { HttpError } from "../../utils/http-errors/http-error";
import { SignUpData } from "./types";

export async function findByEmailConfirmationToken(token: string) {
  return await userDB.findByEmailConfirmationToken(token);
}

export async function findByPasswordResetToken(token: string) {
  return await userDB.findByPasswordResetToken(token);
}

export async function isUserExists({
  userId,
  username,
  email,
}: {
  userId?: number;
  username?: string;
  email?: string;
}) {
  return await userDB.isUserExists({ userId, username, email });
}

export async function isUserDeleted({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}) {
  return await userDB.isUserDeleted({ userId, email });
}

export async function isEmailConfirmed({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}) {
  return await userDB.isEmailConfirmed({ userId, email });
}

export async function confirmEmail(userId: number) {
  const { username, email } = await userDB.confirmEmail(userId);
  const welcomeEmail = createWelcomeEmail({ username, email });
  logger.debug(welcomeEmail);
  // await sendEmail(welcomeEmail);
}

export async function handlePasswordReset(email: string) {
  const token = generateToken();
  await userDB.savePasswordResetToken({ email, token });
  const userEmail = createResetPasswordEmail({ email, token });
  logger.debug(`${__filename}: ${util.inspect(userEmail)}`);
  // await sendEmail(userEmail);
}

export async function updatePassword({
  userId,
  newPassword,
}: {
  userId: number;
  newPassword: string;
}) {
  const hash = await hashPassword(newPassword);
  await userDB.updatePassword({ userId, newPassword: hash });
}

export async function createUser(signupData: SignUpData) {
  const { username, email, password, roleId, isEmailConfirmed } = signupData;

  const userToken = generateToken();

  const { userId } = await userDB.createUser({
    username,
    email,
    password: await hashPassword(password),
    roleId,
    emailConfirmationToken: userToken,
    isEmailConfirmed,
  });

  const userEmail = createConfirmationEmail({
    username,
    email,
    userId,
    userToken,
  });
  logger.debug(`${__filename}: ${util.inspect(userEmail)}`);

  // await sendEmail(confirmationEmail);
}

export async function readUser(userId: number) {
  return await userDB.readUser(userId);
}

export async function readAllUsers() {
  return await userDB.readAllUsers();
}

export async function updateUser({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) {
  return await userDB.updateUser({ userId, username });
}

export async function destroyUser(userId: number) {
  await userDB.destroyUser(userId);
}
