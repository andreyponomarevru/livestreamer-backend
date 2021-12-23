import { Request, Response, NextFunction } from "express";

import * as userService from "../../services/user/user";
import { HttpError } from "../../utils/http-error";
import { User } from "../../models/user/user";

type UpdateUserReqBody = { username: string };
type UpdateUserResBody = { results: User | null };

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
