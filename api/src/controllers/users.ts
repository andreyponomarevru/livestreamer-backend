import { Request, Response, NextFunction } from "express";

import * as authService from "../services/auth/auth";
import { logger } from "../config/logger";
import { HttpError } from "../utils/http-errors/http-error";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = req.headers.basicauth.username;
    const email = req.body.email;

    if (await authService.isUserExists({ username, email })) {
      throw new HttpError(409, "Username or email already exists");
    }

    await authService.createUser({
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

    const { userId } = await authService.findByEmailConfirmationToken(token);
    if (!userId) throw new HttpError(401);
    await authService.confirmEmail(userId);
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
      if (!(await authService.isEmailConfirmed({ email }))) {
        res.status(202).end();
        return;
      } else if (await authService.isUserDeleted({ email })) {
        res.status(202).end();
        return;
      }
      await authService.handlePasswordReset(email);
      res.status(202).end();
    } else if (token && newPassword) {
      const { userId } = await authService.findByPasswordResetToken(token);
      if (!userId) throw new HttpError(401, "Invalid Token");
      await authService.updatePassword({ userId, newPassword });
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
    const userId = req.params.id as unknown as number;

    if (!(await authService.isUserExists({ userId }))) {
      throw new HttpError(404);
    } else if (!(await authService.isEmailConfirmed({ userId }))) {
      throw new HttpError(404, "Pending Account. Please Verify Your Email!");
    } else if (await authService.isUserDeleted({ userId })) {
      throw new HttpError(404);
    }

    const user = await authService.readUser(userId);
    res.json({ results: user });
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
    const users = await authService.readAllUsers();
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
    const userId = req.params.id as unknown as number;
    const username = req.body.username;

    if (!(await authService.isUserExists({ userId }))) {
      throw new HttpError(404);
    } else if (!(await authService.isEmailConfirmed({ userId }))) {
      throw new HttpError(404, "Pending Account. Please Verify Your Email!");
    } else if (await authService.isUserDeleted({ userId })) {
      throw new HttpError(404);
    } else if (await authService.isUserExists({ username })) {
      throw new HttpError(409);
    }

    const updatedUser = await authService.updateUser({ userId, username });
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
    const userId = req.params.id as unknown as number;

    if (!(await authService.isUserExists({ userId }))) {
      throw new HttpError(404);
    } else if (!(await authService.isEmailConfirmed({ userId }))) {
      throw new HttpError(404, "Pending Account. Please Verify Your Email!");
    } else if (await authService.isUserDeleted({ userId })) {
      throw new HttpError(404);
    }

    await authService.destroyUser(userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

//

export async function createBookmark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // TODO
}

export async function readAllBookmarks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // TODO
}

export async function destroyBookmark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // TODO
}
