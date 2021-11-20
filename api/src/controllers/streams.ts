import { Request, Response, NextFunction } from "express";

import { logger } from "../config/logger";
import * as streamService from "../services/stream/stream";
import { HttpError } from "../utils/http-error";
import * as broadcastService from "../services/broadcast/broadcast";
import * as cacheService from "../services/cache/cache";
import { Broadcast } from "../types";

type ReadAllPublishedResBody = { results: Broadcast[] };
type ReadAllHiddenResBody = { results: Broadcast[] };
type UpdatePublishedReqParams = { id?: number };
type UpdatePublishedReqBody = {
  title: string;
  tracklist: string;
  downloadUrl: string;
  listenUrl: string;
  isVisible: boolean;
};
type UpdateHiddenReqParams = { id?: number };
type UpdateHiddenReqBody = {
  title: string;
  tracklist: string;
  downloadUrl: string;
  listenUrl: string;
  isVisible: boolean;
};
type DestroyReqParams = { id?: number };
type SoftDestroyReqParams = { id?: number };
type BookmarkReqParams = { id?: number };
type UnbookmarkReqParams = { id?: number };
type ReadAllBookmarkedResBody = { results: Broadcast[] };

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

export async function readAllHidden(
  req: Request,
  res: Response<ReadAllHiddenResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcasts = await broadcastService.readAllHidden();
    res.json({ results: broadcasts });
  } catch (err) {
    next(err);
  }
}

export async function updatePublished(
  req: Request<UpdatePublishedReqParams, UpdatePublishedReqBody>,
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
}

export async function updateHidden(
  req: Request<UpdateHiddenReqParams, UpdateHiddenReqBody>,
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
}

export async function destroy(
  req: Request<DestroyReqParams>,
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
}

export async function softDestroy(
  req: Request<SoftDestroyReqParams>,
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
}

export async function like(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (streamService.inoutStream.isPaused())
      throw new HttpError({
        code: 404,
        message: "The requested page does not exist",
      });

    await streamService.like({
      userUUID: req.session.authenticatedUser!.uuid!,
      userId: req.session.authenticatedUser!.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function bookmark(
  req: Request<BookmarkReqParams>,
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
}

export async function readAllBookmarked(
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

export async function unbookmark(
  req: Request<UnbookmarkReqParams>,
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
}
