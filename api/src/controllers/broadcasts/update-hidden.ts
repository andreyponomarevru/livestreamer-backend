import { Request, Response, NextFunction } from "express";

import * as broadcastService from "../../services/broadcast/broadcast";

type UpdateHiddenReqParams = { id?: number };
type UpdateHiddenReqBody = {
  title: string;
  tracklist: string;
  downloadUrl: string;
  listenUrl: string;
  isVisible: boolean;
};

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
