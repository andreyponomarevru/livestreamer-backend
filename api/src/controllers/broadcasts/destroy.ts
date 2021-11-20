import { Request, Response, NextFunction } from "express";

import * as broadcastService from "../../services/broadcast/broadcast";

type DestroyReqParams = { id?: number };

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
