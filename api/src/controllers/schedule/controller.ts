import { Request, Response, NextFunction } from "express";
import { scheduleService } from "../../services/schedule";
import { cacheService } from "../../services/cache";
import { logger } from "../../config/logger";
import { Schedule } from "../../types";

export const scheduleController = {
  createScheduledBroadcast: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      {
        title: string;
        startAt: string;
        endAt: string;
      }
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const newBroadcast = await scheduleService.scheduleBroadcast({
        title: req.body.title,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
      });
      res.set("location", `/schedule/${newBroadcast.id}`);
      res.status(200).send({ results: newBroadcast });
    } catch (err) {
      next(err);
    }
  },

  destroyScheduledBroadcast: async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await scheduleService.destroyScheduledBroadcast(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  readAllScheduledBroadcasts: async function (
    req: Request,
    res: Response<{ results: Schedule[] }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cacheKey = `schedule`;
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        logger.debug(`${__filename} Got cached data`);
        res.status(200).json(
          cachedData as {
            results: Schedule[];
          },
        );
        return;
      }

      const broadcasts = await scheduleService.readAllScheduledBroadcasts();
      await cacheService.saveWithTTL(cacheKey, { results: broadcasts }, 300);

      res.status(200);
      res.json({ results: broadcasts });
    } catch (err) {
      next(err);
    }
  },
};
