import { Request, Response, NextFunction } from "express";

import * as scheduleService from "./../../services/schedule/schedule";

export async function destroyScheduledBroadcast(
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
}
