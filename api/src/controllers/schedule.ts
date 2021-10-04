import { Request, Response, NextFunction } from "express";

import * as scheduleService from "./../services/schedule/schedule";

export async function createScheduledBroadcast(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = await scheduleService.scheduleBroadcast({
      title: req.body.title,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
    });
    res.set("location", `/schedule/${id}`);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function readAllScheduledBroadcasts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcasts = await scheduleService.readAllScheduledBroadcasts();
    res.status(200).json(broadcasts);
  } catch (err) {
    next(err);
  }
}

export async function destroyScheduledBroadcast(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await scheduleService.destroyScheduledBroadcast(Number(req.params.id));
    console.log("HERE");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
