import { Request, Response, NextFunction } from "express";

import { logger } from "../../config/logger";
import * as broadcastService from "../../services/broadcast/broadcast";
import * as cacheService from "../../services/cache/cache";
import { Broadcast } from "../../types";

type ReadAllPublishedResBody = { results: Broadcast[] };

export async function readAllPublished(
  req: Request,
  res: Response<ReadAllPublishedResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = `public_broadcasts`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug(`${__filename} Got cached data`);
      res.status(200).json(cachedData as ReadAllPublishedResBody);
      return;
    }

    const broadcasts = await broadcastService.readAllPublished();
    await cacheService.saveWithTTL(cacheKey, { results: broadcasts }, 300);

    res.status(200).json({ results: broadcasts });
  } catch (err) {
    next(err);
  }
}
