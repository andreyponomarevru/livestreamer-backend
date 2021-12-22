import { Request, Response, NextFunction } from "express";

import * as userService from "../../services/user/user";
import { HttpError } from "../../utils/http-error";

type CreateUserReqBody = { email: string };

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
