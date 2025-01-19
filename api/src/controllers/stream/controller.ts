import { Request, Response, NextFunction } from "express";
import { streamService, inoutStream } from "../../services/stream";
import { HttpError } from "../../utils/http-error";
import { pull } from "./pull-stream";
import { push } from "./push-stream";

export const streamController = {
  likeStream: async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (inoutStream.isPaused())
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
  },

  pull,

  push,
};
