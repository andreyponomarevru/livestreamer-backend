import { Request, Response, NextFunction } from "express";

import { logger } from "../config/logger";
import { wsServer } from "../ws-server";
import * as db from "../models/broadcast/queries";
import * as broadcastService from "../services/broadcast/broadcast";
import inoutStream from "../services/stream/inout-stream";
import broadcastEvents from "./../services/broadcast/broadcast-events";
import { SavedBroadcastLike } from "../types";

function onLikeBroadcast(like: SavedBroadcastLike) {
  wsServer.sendToAllExceptSender(
    { event: "broadcast:like", data: like },
    like.likedByUserId,
  );
}
broadcastEvents.on("like", onLikeBroadcast);

export async function readAllPublished(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcasts = await broadcastService.readAllPublishedBroadcasts();
    res.json({ results: broadcasts });
  } catch (err) {
    next(err);
  }
}

export async function readAllHidden(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcasts = await broadcastService.readAllHiddenBroadcasts();
    res.json({ results: broadcasts });
  } catch (err) {
    next(err);
  }
}

export async function updatePublished(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await broadcastService.updatePublishedBroadcast({
      id: Number(req.params.id),
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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await broadcastService.updateHiddenBroadcast({
      id: Number(req.params.id),
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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcastId = Number(req.params.id);
    await broadcastService.destroyBroadcast(broadcastId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function softDestroy(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcastId = Number(req.params.id);
    await broadcastService.updatePublishedBroadcast({
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
    if (inoutStream.isPaused()) res.status(404).end();

    // TODO: retrieve broadcast ID from Redis
    await broadcastService.likeBroadcast({
      userId: req.body.userId,
      broadcastId: req.body.broadcastId,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function bookmark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await broadcastService.bookmarkBroadcast({
      userId: req.session.authenticatedUser!.id,
      broadcastId: req.body.broadcastId,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function readAllBookmarked(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcasts = await broadcastService.readAllBookmarkedBroadcasts(
      req.session.authenticatedUser!.id,
    );
    res.status(200).json({ results: broadcasts });
  } catch (err) {
    next(err);
  }
}

export async function unbookmark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await broadcastService.unbookmarkBroadcast({
      userId: req.session.authenticatedUser!.id,
      broadcastId: Number(req.params.broadcastId),
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
