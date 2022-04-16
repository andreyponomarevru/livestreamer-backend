import { SignUpData } from "../../types";
import { User } from "../../models/user/user";
import * as authService from "../authn/authn";
import * as mailService from "./../mail/send-email";
import { createConfirmationEmail } from "./../mail/email-templates";
import { NODE_ENV } from "../../config/env";
import * as usersDB from "../../models/user/queries";
import { logger } from "../../config/logger";

export async function createUser(signupData: SignUpData): Promise<void> {
  const userToken = authService.generateToken();

  const { userId } = await usersDB.createUser({
    username: signupData.username,
    email: signupData.email,
    password: await authService.hashPassword(signupData.password),
    roleId: signupData.roleId,
    emailConfirmationToken: userToken,
    isEmailConfirmed: signupData.isEmailConfirmed,
  });

  const singUpConfirmationEmail = createConfirmationEmail({
    username: signupData.username,
    email: signupData.email,
    userId: userId,
    userToken: userToken,
  });

  if (NODE_ENV === "production") {
    await mailService.sendEmail(singUpConfirmationEmail);
  } else {
    logger.debug(singUpConfirmationEmail);
  }
}

export async function readUser(userId: number): Promise<User> {
  return await usersDB.readUser(userId);
}

export async function readAllUsers(): Promise<User[]> {
  return await usersDB.readAllUsers();
}

export async function updateUser({
  userId,
  username,
}: {
  userId: number;
  username: string;
}): Promise<User | null> {
  return await usersDB.updateUser({ userId, username });
}

export async function destroyUser(userId: number): Promise<void> {
  await usersDB.destroyUser(userId);
}

export async function isUserExists({
  userId,
  username,
  email,
}: {
  userId?: number;
  username?: string;
  email?: string;
}): Promise<boolean> {
  return await usersDB.isUserExists({ userId, username, email });
}

export async function isUserDeleted({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}): Promise<boolean> {
  return await usersDB.isUserDeleted({ userId, email });
}

export async function updatePassword({
  userId,
  newPassword,
}: {
  userId: number;
  newPassword: string;
}): Promise<void> {
  const hash = await authService.hashPassword(newPassword);
  await usersDB.updatePassword({ userId, newPassword: hash });
}

export async function updateLastLoginTime(userId: number): Promise<{
  lastLoginAt: string;
}> {
  return await usersDB.updateLastLoginTime(userId);
}

export async function isEmailConfirmed({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}): Promise<boolean> {
  return await usersDB.isEmailConfirmed({ userId, email });
}

export async function findByUsernameOrEmail({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<User | null> {
  return await usersDB.findByUsernameOrEmail({ username, email });
}

export async function findByEmailConfirmationToken(token: string): Promise<{
  userId: number | null;
}> {
  return await usersDB.findByEmailConfirmationToken(token);
}

export async function findByPasswordResetToken(token: string): Promise<{
  userId: number | null;
}> {
  return await usersDB.findByPasswordResetToken(token);
}
