import { Request, Response, NextFunction } from "express";

import * as broadcastService from "../../services/broadcast/broadcast";

type UpdatePublishedReqParams = { id?: number };
type UpdatePublishedReqBody = {
  title: string;
  tracklist: string;
  downloadUrl: string;
  listenUrl: string;
  isVisible: boolean;
};

export async function updatePublished(
  req: Request<UpdatePublishedReqParams, UpdatePublishedReqBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await broadcastService.updatePublished({
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
