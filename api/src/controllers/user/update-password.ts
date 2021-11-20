import { Request, Response, NextFunction } from "express";

import * as authnService from "../../services/authn/authn";
import * as userService from "../../services/user/user";
import { HttpError } from "../../utils/http-error";

type UpdatePasswordReqBody = {
  email: string;
  token: string;
  newPassword: string;
};

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
