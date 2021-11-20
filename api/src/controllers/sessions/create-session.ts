import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import * as authService from "../../services/authn/authn";
import * as userService from "../../services/user/user";
import { HttpError } from "../../utils/http-error";
import { logger } from "../../config/logger";
import { SanitizedUser } from "../../types";
import { sanitizeUser } from "../../models/user/sanitize-user";

type CreateSessionReqBody = {
  username: string;
  email: string;
  password: string;
};

export async function createSession(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateSessionReqBody
  >,
  res: Response<{ results: SanitizedUser }>,
  next: NextFunction,
): Promise<void> {
  try {
    if (req.body.username && req.body.email) {
      throw new HttpError({
        code: 400,
        message: "Specify either email OR username",
      });
    }

    if (req.session.authenticatedUser) {
      logger.debug(
        `${__filename} [createSession] User is already authenticated `,
      );
      res
        .status(200)
        .json({ results: sanitizeUser(req.session.authenticatedUser) });

      return;
    }

    const user = await userService.findByUsernameOrEmail({
      email: req.body.email,
      username: req.body.username,
    });

    if (!user) {
      throw new HttpError({
        code: 401,
        message: "Invalid email, username or password",
      });
    }

    if (!user.isEmailConfirmed) {
      throw new HttpError({
        code: 404,
        message:
          "Pending Account. Look for the verification email in your inbox and click the link in that email",
      });
    }

    if (user.isDeleted) {
      logger.error(
        `${__filename} [createSession] Deleted user ${user.username} tries to sign in`,
      );
      throw new HttpError({
        code: 401,
        message: "Invalid email, username or password",
      });
    }

    if (await authService.isPasswordMatch(req.body.password, user.password)) {
      // We need to save uuid in session to be able to use it later when client ends the session by signing out: using this uuid we find the closed socket in WSClientStore and remove this socket. This is the only purpose of storing uuid in user object/in session.
      // TODO: move lastLoginTime update to Model level, call 'updateLastLoginTime' from 'readUser' or something like that
      const { lastLoginAt } = await userService.updateLastLoginTime(user.id);
      user.lastLoginAt = lastLoginAt;
      user.uuid = uuidv4();
      req.session.authenticatedUser = user;
      logger.debug(
        `${__filename} [createSession] User ${user.username} is authenticated and saved in session`,
      );
      logger.debug(user);

      res.status(200).json({ results: sanitizeUser(user) });
    } else {
      throw new HttpError({
        code: 401,
        message: "Invalid email, username or password",
      });
    }
  } catch (err) {
    next(err);
  }
}
