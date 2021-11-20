import { Request, Response, NextFunction } from "express";

import * as broadcastService from "../../services/broadcast/broadcast";

type UnbookmarkReqParams = { id?: number };

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
