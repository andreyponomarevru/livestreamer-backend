import util from "util";

import * as usersDB from "../../models/user/queries";
import { logger } from "../../config/logger";
import { hashPassword, generateToken } from "../../utils/utils";
import { sendEmail } from "./send-email";
import {
  createWelcomeEmail,
  createConfirmationEmail,
  createResetPasswordEmail,
} from "./email-templates";
import { SignUpData } from "./types";

export async function findByEmailConfirmationToken(token: string) {
  return await usersDB.findByEmailConfirmationToken(token);
}

export async function findByPasswordResetToken(token: string) {
  return await usersDB.findByPasswordResetToken(token);
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
  return await usersDB.isUserExists({ userId, username, email });
}

export async function isUserDeleted({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}) {
  return await usersDB.isUserDeleted({ userId, email });
}

export async function isEmailConfirmed({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}) {
  return await usersDB.isEmailConfirmed({ userId, email });
}

export async function confirmEmail(userId: number) {
  const { username, email } = await usersDB.confirmEmail(userId);
  const welcomeEmail = createWelcomeEmail({ username, email });
  logger.debug(welcomeEmail);
  // await sendEmail(welcomeEmail);
}

export async function handlePasswordReset(email: string) {
  const token = generateToken();
  await usersDB.savePasswordResetToken({ email, token });
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
  await usersDB.updatePassword({ userId, newPassword: hash });
}

export async function createUser(signupData: SignUpData) {
  const { username, email, password, roleId, isEmailConfirmed } = signupData;

  const userToken = generateToken();

  const { userId } = await usersDB.createUser({
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

  // await sendEmail(confirmationEmail);
}

export async function readUser(userId: number) {
  return await usersDB.readUser(userId);
}

export async function readAllUsers() {
  return await usersDB.readAllUsers();
}

export async function updateUser({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) {
  return await usersDB.updateUser({ userId, username });
}

export async function destroyUser(userId: number) {
  await usersDB.destroyUser(userId);
}

export async function findByUsernameOrEmail({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) {
  return await usersDB.findByUsernameOrEmail({ username, email });
}

export async function updateLastLoginTime(userId: number) {
  return await usersDB.updateLastLoginTime(userId);
}
