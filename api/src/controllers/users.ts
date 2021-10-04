import { Request, Response, NextFunction } from "express";

import * as authnService from "../services/authn/authn";
import { logger } from "../config/logger";
import { HttpError } from "../utils/http-errors/http-error";
import { COOKIE_NAME } from "../config/env";
import { clientStore } from "./../services/chat/ws-client-store";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = req.headers.basicauth.username;
    const email = req.body.email;

    if (req.session.authenticatedUser) {
      throw new HttpError(403);
    } else if (await authnService.isUserExists({ username, email })) {
      throw new HttpError(409, "Username or email already exists");
    }

    await authnService.createUser({
      username: req.headers.basicauth.username,
      password: req.headers.basicauth.password,
      email: req.body.email,
      roleId: 3,
      isEmailConfirmed: false,
    });

    res.status(202).end();
  } catch (err) {
    next(err);
  }
}

export async function confirmUserSignUp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.query.token as string;

    const { userId } = await authnService.findByEmailConfirmationToken(token);
    if (!userId) throw new HttpError(401);
    await authnService.confirmEmail(userId);
    res.set("location", `/users/${userId}`);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const email = req.body.email as string;
    const token = req.body.token as string;
    const newPassword = req.body.newPassword as string;

    if (email) {
      if (!(await authnService.isEmailConfirmed({ email }))) {
        res.status(202).end();
        return;
      } else if (await authnService.isUserDeleted({ email })) {
        res.status(202).end();
        return;
      }
      await authnService.handlePasswordReset(email);
      res.status(202).end();
    } else if (token && newPassword) {
      const { userId } = await authnService.findByPasswordResetToken(token);
      if (!userId) throw new HttpError(401, "Invalid Token");
      await authnService.updatePassword({ userId, newPassword });
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
}

export async function readUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authnService.readUser(req.session.authenticatedUser!.id);
    res.json({ results: user.sanitized });
  } catch (err) {
    next(err);
  }
}

export async function readAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await authnService.readAllUsers();
    res.json({ results: users });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.params.userId as unknown as number;
    const username = req.body.username;

    if (!(await authnService.isUserExists({ userId }))) {
      throw new HttpError(404);
    } else if (!(await authnService.isEmailConfirmed({ userId }))) {
      throw new HttpError(404, "Pending Account. Please Verify Your Email!");
    } else if (await authnService.isUserDeleted({ userId })) {
      throw new HttpError(404);
    } else if (await authnService.isUserExists({ username })) {
      throw new HttpError(409);
    }

    const updatedUser = await authnService.updateUser({
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
    const userId = req.params.userId as unknown as number;

    if (!(await authnService.isUserExists({ userId }))) {
      throw new HttpError(404);
    } else if (!(await authnService.isEmailConfirmed({ userId }))) {
      throw new HttpError(404, "Pending Account. Please Verify Your Email!");
    } else if (await authnService.isUserDeleted({ userId })) {
      throw new HttpError(404);
    }

    await authnService.destroyUser(userId);

    const wsClient = clientStore.getClient(req.session.authenticatedUser!.id);

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
