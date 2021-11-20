import { Request, Response, NextFunction } from "express";

import * as authnService from "../../services/authn/authn";
import * as userService from "../../services/user/user";
import { HttpError } from "../../utils/http-error";

type ConfirmUserSignUpReqQuery = { token: string };

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
