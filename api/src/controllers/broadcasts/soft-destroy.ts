import { Request, Response, NextFunction } from "express";

import * as broadcastService from "../../services/broadcast/broadcast";

type SoftDestroyReqParams = { id?: number };

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
