import { Request, Response, NextFunction } from "express";

import * as scheduleService from "./../../services/schedule/schedule";

type CreateScheduledBroadcastReqBody = {
  title: string;
  startAt: string;
  endAt: string;
};

export async function createScheduledBroadcast(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateScheduledBroadcastReqBody
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
}
