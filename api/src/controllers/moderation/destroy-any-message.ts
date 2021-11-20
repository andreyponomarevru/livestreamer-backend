import { Request, Response, NextFunction } from "express";

import * as chatService from "../../services/chat/chat";

type DestroyAnyMsgQuery = { id?: number };
type DestroyAnyMsgParams = { user_id?: number };

export async function destroyAnyMsg(
  req: Request<
    DestroyAnyMsgQuery,
    Record<string, unknown>,
    Record<string, unknown>,
    DestroyAnyMsgParams
  >,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await chatService.destroyMsg({
      userUUID: req.session.authenticatedUser!.uuid!,
      userId: req.query.user_id as unknown as number,
      id: req.params.id as number,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
