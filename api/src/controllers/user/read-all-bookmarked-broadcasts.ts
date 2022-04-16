import { Request, Response, NextFunction } from "express";

import { logger } from "../../config/logger";
import * as broadcastService from "../../services/broadcast/broadcast";
import * as cacheService from "../../services/cache/cache";
import { Broadcast } from "../../types";

type ReadAllBookmarkedResBody = { results: Broadcast[] };

export async function readAllBookmarkedBroadcasts(
  req: Request,
  res: Response<ReadAllBookmarkedResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = `user_${req.session.authenticatedUser!.id}_bookmarks`;
    const cachedData = await cacheService.get(cacheKey);

    if (cachedData) {
      logger.debug(`${__filename} Got cached data`);
      res.status(200).json(cachedData as ReadAllBookmarkedResBody);
      return;
    }

    const broadcasts = await broadcastService.readAllBookmarked(
      req.session.authenticatedUser!.id,
    );
    await cacheService.saveWithTTL(cacheKey, { results: broadcasts }, 300);

    res.status(200).json({ results: broadcasts });
  } catch (err) {
    next(err);
  }
}
