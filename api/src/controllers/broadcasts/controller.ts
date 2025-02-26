import { Request, Response, NextFunction } from "express";
import { broadcastService } from "../../services/broadcast";
import { Broadcast } from "../../types";
import { logger } from "../../config/logger";
import { cacheService } from "../../services/cache";

export const broadcastController = {
  bookmark: async function (
    req: Request<{ id?: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await broadcastService.bookmark({
        userId: req.session.authenticatedUser!.id,
        broadcastId: req.params.id as number,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  destroy: async function (
    req: Request<{ id?: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const broadcastId = req.params.id as number;
      await broadcastService.destroy(broadcastId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  readAllHidden: async function (
    req: Request,
    res: Response<{ results: Broadcast[] }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const broadcasts = await broadcastService.readAllHidden();
      res.json({ results: broadcasts });
    } catch (err) {
      next(err);
    }
  },

  readAllPublished: async function (
    req: Request,
    res: Response<{ results: Broadcast[] }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cacheKey = `public_broadcasts`;
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        logger.debug(`${__filename} Got cached data`);
        res.status(200).json(cachedData as { results: Broadcast[] });
        return;
      }

      const broadcasts = await broadcastService.readAllPublished();
      await cacheService.saveWithTTL(cacheKey, { results: broadcasts }, 300);

      res.status(200).json({ results: broadcasts });
    } catch (err) {
      next(err);
    }
  },

  softDestroy: async function (
    req: Request<{ id?: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const broadcastId = req.params.id as number;
      await broadcastService.updatePublished({
        id: broadcastId,
        isVisible: false,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  unbookmark: async function (
    req: Request<{ id?: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await broadcastService.unbookmark({
        userId: req.session.authenticatedUser!.id,
        broadcastId: req.params.id as number,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  updateHidden: async function (
    req: Request<
      { id?: number },
      {
        title: string;
        tracklist: string;
        downloadUrl: string;
        listenUrl: string;
        isVisible: boolean;
      }
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await broadcastService.updateHidden({
        id: req.params.id as number,
        title: req.body.title,
        tracklist: req.body.tracklist,
        downloadUrl: req.body.downloadUrl,
        listenUrl: req.body.listenUrl,
        isVisible: req.body.isVisible,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  updatePublished: async function (
    req: Request<
      { id?: number },
      {
        title: string;
        tracklist: string;
        downloadUrl: string;
        listenUrl: string;
        isVisible: boolean;
      }
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await broadcastService.updatePublished({
        id: req.params.id as number,
        title: req.body.title,
        tracklist: req.body.tracklist,
        downloadUrl: req.body.downloadUrl,
        listenUrl: req.body.listenUrl,
        isVisible: req.body.isVisible,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
