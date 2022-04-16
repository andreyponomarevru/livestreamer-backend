import { Request, Response, NextFunction } from "express";

import * as chatService from "../../services/chat/chat";

type DestroyOwnMsgReqParams = { id?: number };

export async function destroyOwnMsg(
  req: Request<DestroyOwnMsgReqParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await chatService.destroyMsg({
      userUUID: req.session.authenticatedUser!.uuid!,
      userId: req.session.authenticatedUser!.id,
      id: req.params.id!,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
