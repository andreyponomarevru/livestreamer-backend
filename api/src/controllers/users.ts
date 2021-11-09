import { Request, Response, NextFunction } from "express";

import * as authnService from "../services/authn/authn";
import * as userService from "../services/user/user";
import { logger } from "../config/logger";
import { HttpError } from "../utils/http-error";
import { COOKIE_NAME } from "../config/env";
import * as wsService from "../services/ws/ws";
import * as cacheService from "../services/cache/cache";
import { User } from "../models/user/user";
import { SanitizedUser } from "../types";
import { sanitizeUser } from "../models/user/sanitize-user";

type CreateUserReqBody = { email: string };
type ConfirmUserSignUpReqQuery = { token: string };
type UpdatePasswordReqBody = {
  email: string;
  token: string;
  newPassword: string;
};
type UpdateUserReqBody = { username: string };
type UpdateUserResBody = { results: User | null };
type ReadAllUsersResBody = { results: User[] };
type ReadUserResBody = { results: SanitizedUser };

export async function createUser(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateUserReqBody
  >,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = req.headers.basicauth.username;
    const email = req.body.email;

    if (await userService.isUserExists({ username, email })) {
      throw new HttpError({
        code: 409,
        message: "Username or email already exists",
      });
    }

    // TODO: don't hard code role id, pass it as a string like 'listener', trwite SQL to insert based on this string instead of id
    await userService.createUser({
      username: req.headers.basicauth.username,
      password: req.headers.basicauth.password,
      email: req.body.email,
      roleId: 2,
      isEmailConfirmed: false,
    });

    res.status(202).end();
  } catch (err) {
    next(err);
  }
}

export async function confirmUserSignUp(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    ConfirmUserSignUpReqQuery
  >,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.query.token;

    const { userId } = await userService.findByEmailConfirmationToken(token);
    if (userId) {
      await authnService.confirmEmail(userId);
      res.set("location", `/users/${userId}`);
      res.status(204).end();
    } else {
      throw new HttpError({
        code: 401,
        message: "Confirmation token is invalid",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UpdatePasswordReqBody
  >,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const email = req.body.email;
    const token = req.body.token;
    const newPassword = req.body.newPassword;

    if (email) {
      if (!(await userService.isEmailConfirmed({ email }))) {
        res.status(202).end();
        return;
      } else if (await userService.isUserDeleted({ email })) {
        res.status(202).end();
        return;
      }
      await authnService.handlePasswordReset(email);
      res.status(202).end();
    } else if (token && newPassword) {
      const { userId } = await userService.findByPasswordResetToken(token);
      if (!userId)
        throw new HttpError({
          code: 401,
          message: "Confirmation token is invalid",
        });
      await userService.updatePassword({ userId, newPassword });
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
}

export async function readUser(
  req: Request,
  res: Response<ReadUserResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = `user_id_${req.session.authenticatedUser!.id}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug(`${__filename} Got cached data`);
      res.status(200).json(cachedData as { results: SanitizedUser });
      return;
    }

    const user = await userService.readUser(req.session.authenticatedUser!.id);
    await cacheService.saveWithTTL(
      cacheKey,
      { results: sanitizeUser(user) },
      300,
    );

    res.status(200).json({ results: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function readAllUsers(
  req: Request,
  res: Response<ReadAllUsersResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = `users`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug(`${__filename} Got cached data`);
      res.status(200).json(cachedData as { results: User[] });
      return;
    }

    const users = await userService.readAllUsers();
    await cacheService.saveWithTTL(cacheKey, { results: users }, 300);
    res.status(200).json({ results: users });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UpdateUserReqBody
  >,
  res: Response<UpdateUserResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.session.authenticatedUser!.id;
    const username = req.body.username;

    if (!(await userService.isUserExists({ userId }))) {
      throw new HttpError({ code: 404 });
    } else if (!(await userService.isEmailConfirmed({ userId }))) {
      throw new HttpError({
        code: 404,
        message:
          "Pending Account. Look for the verification email in your inbox and click the link in that email",
      });
    } else if (await userService.isUserDeleted({ userId })) {
      throw new HttpError({ code: 404 });
    } else if (await userService.isUserExists({ username })) {
      throw new HttpError({
        code: 409,
        message: "Sorry, this username is already taken",
      });
    }

    const updatedUser = await userService.updateUser({
      userId,
      username,
    });
    res.set("location", `/users/${userId}`);
    res.status(200);
    res.json({ results: updatedUser });
  } catch (err) {
    next(err);
  }
}

export async function destroyUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.session.authenticatedUser!.id as number;
    const userUUID = req.session.authenticatedUser!.uuid as string;

    if (!(await userService.isUserExists({ userId }))) {
      res.status(204).end();
      logger.debug("User does'nt exist");
    } else if (!(await userService.isEmailConfirmed({ userId }))) {
      throw new HttpError({
        code: 404,
        message:
          "Pending Account. Look for the verification email in your inbox and click the link in that email",
      });
    } else if (await userService.isUserDeleted({ userId })) {
      throw new HttpError({ code: 404 });
    }

    await userService.destroyUser(userId);

    const wsClient = wsService.clientStore.getClient(userUUID);

    req.session.destroy((err) => {
      // You cannot access session here, it has been already destroyed
      if (err) logger.error(`${__filename}: ${err}`);

      if (wsClient) wsClient.socket.close();
      res.clearCookie(COOKIE_NAME);
      res.status(204).end();

      logger.debug(
        `${__filename}: Session Destroyed! Account has been signed out.`,
      );
    });
  } catch (err) {
    next(err);
  }
}
