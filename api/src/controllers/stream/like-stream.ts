import { Request, Response, NextFunction } from "express";

import * as streamService from "../../services/stream/stream";
import { HttpError } from "../../utils/http-error";

export async function likeStream(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (streamService.inoutStream.isPaused())
      throw new HttpError({
        code: 404,
        message: "The requested page does not exist",
      });

    await streamService.like({
      userUUID: req.session.authenticatedUser!.uuid!,
      userId: req.session.authenticatedUser!.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
