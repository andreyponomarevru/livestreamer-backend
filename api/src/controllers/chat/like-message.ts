import { Request, Response, NextFunction } from "express";

import { HttpError } from "../../utils/http-error";
import * as chatService from "../../services/chat/chat";

type LikeMsgParams = { id?: number };

export async function likeMsg(
  req: Request<LikeMsgParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await chatService.likeMsg({
      userUUID: req.session.authenticatedUser!.uuid!,
      userId: req.session.authenticatedUser!.id,
      id: req.params.id!,
    });
    res.status(204).end();
  } catch (err) {
    if ("23503" === err.code) {
      next(new HttpError({ code: 422 }));
    } else {
      next(err);
    }
  }
}
