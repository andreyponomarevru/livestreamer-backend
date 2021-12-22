import { Request, Response, NextFunction } from "express";

import * as userService from "../../services/user/user";
import { logger } from "../../config/logger";
import * as cacheService from "../../services/cache/cache";
import { SanitizedUser } from "../../types";
import { sanitizeUser } from "../../models/user/sanitize-user";

type ReadUserResBody = { results: SanitizedUser };

export async function readUser(
  req: Request,
  res: Response<ReadUserResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = `user_id_${req.session.authenticatedUser!.id}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug(`${__filename} Got cached data`);
      res.status(200).json(cachedData as { results: SanitizedUser });
      return;
    }

    const user = await userService.readUser(req.session.authenticatedUser!.id);
    await cacheService.saveWithTTL(
      cacheKey,
      { results: sanitizeUser(user) },
      300,
    );

    res.status(200).json({ results: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}
