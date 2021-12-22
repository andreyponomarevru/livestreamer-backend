import { Request, Response, NextFunction } from "express";

import * as scheduleService from "./../../services/schedule/schedule";
import * as cacheService from "../../services/cache/cache";
import { logger } from "../../config/logger";
import { Schedule } from "../../types";

type CreateScheduledBroadcastResBody = {
  results: Schedule[];
};

export async function readAllScheduledBroadcasts(
  req: Request,
  res: Response<{ results: Schedule[] }>,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = `schedule`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug(`${__filename} Got cached data`);
      res.status(200).json(cachedData as CreateScheduledBroadcastResBody);
      return;
    }

    const broadcasts = await scheduleService.readAllScheduledBroadcasts();
    await cacheService.saveWithTTL(cacheKey, { results: broadcasts }, 300);

    res.status(200);
    res.json({ results: broadcasts });
  } catch (err) {
    next(err);
  }
}
