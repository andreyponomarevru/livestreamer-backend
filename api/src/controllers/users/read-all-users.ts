import { Request, Response, NextFunction } from "express";

import * as userService from "../../services/user/user";
import { logger } from "../../config/logger";
import * as cacheService from "../../services/cache/cache";
import { User } from "../../models/user/user";

type ReadAllUsersResBody = { results: User[] };

export async function readAllUsers(
  req: Request,
  res: Response<ReadAllUsersResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = `users`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug(`${__filename} Got cached data`);
      res.status(200).json(cachedData as { results: User[] });
      return;
    }

    const users = await userService.readAllUsers();
    await cacheService.saveWithTTL(cacheKey, { results: users }, 300);
    res.status(200).json({ results: users });
  } catch (err) {
    next(err);
  }
}
