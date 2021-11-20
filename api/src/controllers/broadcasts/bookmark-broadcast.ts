import { Request, Response, NextFunction } from "express";

import * as broadcastService from "../../services/broadcast/broadcast";

type BookmarkReqParams = { id?: number };

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
