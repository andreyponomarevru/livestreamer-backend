import { Request, Response, NextFunction } from "express";

import { HttpError } from "../../utils/http-error";
import * as chatService from "../../services/chat/chat";

type UnlikeMsgParams = { id?: number };

export async function unlikeMsg(
  req: Request<UnlikeMsgParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await chatService.unlikeMsg({
      id: req.params.id!,
      userUUID: req.session.authenticatedUser!.uuid!,
      userId: req.session.authenticatedUser!.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
