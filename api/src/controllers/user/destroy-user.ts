import { Request, Response, NextFunction } from "express";

import * as userService from "../../services/user/user";
import { logger } from "../../config/logger";
import { HttpError } from "../../utils/http-error";
import { COOKIE_NAME } from "../../config/env";
import * as wsService from "../../services/ws/ws";

export async function destroyUser(
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
}
