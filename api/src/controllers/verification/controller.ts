import { Request, Response, NextFunction } from "express";
import { authnService } from "../../services/authn";
import { userService } from "../../services/user";
import { HttpError } from "../../utils/http-error";

export const verificationController = {
  confirmUserSignUp: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      { token: string }
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
  },
};
