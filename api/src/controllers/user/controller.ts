import { Request, Response, NextFunction } from "express";
import { userService } from "../../services/user/user";
import { HttpError } from "../../utils/http-error";
import { CustomRequest } from "../../types";
import { logger } from "../../config/logger";
import { COOKIE_NAME } from "../../config/env";
import { wsService } from "../../services/ws";
import { cacheService } from "../../services/cache";
import { SanitizedUser } from "../../types";
import { sanitizeUser } from "../../models/user/sanitize-user";
import { authnService } from "../../services/authn";
import { User } from "../../models/user/user";
import { Broadcast } from "../../types";
import { broadcastService } from "../../services/broadcast";

export const userController = {
  createUser: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { email: string }
    > &
      CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (
        !req.headers.basicauth?.username ||
        !req.headers.basicauth?.password
      ) {
        throw new HttpError({ code: 400 });
      }

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
        username: req.headers.basicauth?.username,
        password: req.headers.basicauth?.password,
        email: req.body.email,
        roleId: 2,
        isEmailConfirmed: false,
      });

      res.status(202).end();
    } catch (err) {
      next(err);
    }
  },

  destroyUser: async function (
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
  },

  readUser: async function (
    req: Request,
    res: Response<{ results: SanitizedUser }>,
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

      const user = await userService.readUser(
        req.session.authenticatedUser!.id,
      );
      await cacheService.saveWithTTL(
        cacheKey,
        { results: sanitizeUser(user) },
        300,
      );

      res.status(200).json({ results: sanitizeUser(user) });
    } catch (err) {
      next(err);
    }
  },

  updatePassword: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      {
        email: string;
        token: string;
        newPassword: string;
      }
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
  },

  updateUser: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { username: string }
    >,
    res: Response<{ results: User | null }>,
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
  },

  readAllBookmarkedBroadcasts: async function (
    req: Request,
    res: Response<{ results: Broadcast[] }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cacheKey = `user_${req.session.authenticatedUser!.id}_bookmarks`;
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        logger.debug(`${__filename} Got cached data`);
        res.status(200).json(cachedData as { results: Broadcast[] });
        return;
      }

      const broadcasts = await broadcastService.readAllBookmarked(
        req.session.authenticatedUser!.id,
      );
      await cacheService.saveWithTTL(cacheKey, { results: broadcasts }, 300);

      res.status(200).json({ results: broadcasts });
    } catch (err) {
      next(err);
    }
  },
};
