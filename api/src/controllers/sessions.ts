import util from "util";

import { Request, Response, NextFunction } from "express";

import * as authService from "../services/authn/authn";
import { HttpError } from "../utils/http-errors/http-error";
import { logger } from "../config/logger";
import { isPasswordMatch } from "../utils/utils";
import { COOKIE_NAME } from "../config/env";
import { clientStore } from "./../services/chat/ws-client-store";

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // TODO: update 'lastLogin' prop of userc object stored in session. Or maybe it is updated automatically or you can take it from cookie properrty? But you need to save it in database as well - do it on successful session creation

  try {
    if (req.body.username && req.body.email) {
      throw new HttpError(400, "Specify either email or username");
    }

    if (req.session.authenticatedUser) {
      logger.debug(
        `${__filename} [createSession] User is already authenticated `,
      );
      res.status(200).json(req.session.authenticatedUser.sanitized);
      return;
    }

    const user = await authService.findByUsernameOrEmail({
      email: req.body.email,
      username: req.body.username,
    });

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    if (!user.isEmailConfirmed) {
      throw new HttpError(404, "Pending account. Please verify your email");
    }

    if (user.isDeleted) {
      logger.error(
        `${__filename} [createSession] Deleted user ${user.username} tries to sign in`,
      );
      throw new HttpError(401, "Invalid credentials");
    }

    if (await isPasswordMatch(req.body.password, user.password)) {
      const { lastLoginAt } = await authService.updateLastLoginTime(user.id);
      user.lastLoginAt = lastLoginAt;
      req.session.authenticatedUser = user;
      logger.debug(
        `${__filename} [createSession] User ${user.username} is authenticated and saved in session`,
      );
      logger.debug(user);
      res.status(200).json(user);
    } else {
      throw new HttpError(401, "Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
}

export async function destroySession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const wsClient = clientStore.getClient(req.session.authenticatedUser!.id);

    logger.debug(
      `${__filename} [destroySession] Authenticated user is signing out: `,
      req.session.authenticatedUser,
    );
    logger.debug(
      `${__filename} [destroySession] clients in store: ${util.inspect(
        clientStore.getAllClients(),
      )}`,
    );

    // Handle situation when the client has signed in, but hadn't connected over WS
    if (wsClient) {
      logger.debug(
        `WSClient ${util.inspect(
          wsClient.username,
        )} will be deleted from WSStore`,
      );
    }

    req.session.destroy((err) => {
      // You cannot access session here, it has been already destroyed
      if (err) logger.error(`${__filename}: ${err}`);

      if (wsClient) wsClient.socket.close();
      res.clearCookie(COOKIE_NAME);
      res.status(204).end();

      logger.debug(
        `${__filename}: Session Destroyed! User has been signed out.`,
      );
    });
  } catch (err) {
    next(err);
  }
}
