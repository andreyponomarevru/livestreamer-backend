import { Request, Response, NextFunction } from "express";

import * as broadcastService from "../../services/broadcast/broadcast";
import { Broadcast } from "../../types";

type ReadAllHiddenResBody = { results: Broadcast[] };

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
