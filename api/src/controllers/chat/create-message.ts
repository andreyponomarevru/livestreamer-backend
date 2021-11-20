import { Request, Response, NextFunction } from "express";

import * as chatService from "../../services/chat/chat";
import { ChatMsg } from "../../types";

type CreateMessageReqBody = { message: string };
type CreateMessageResBody = { results: ChatMsg };

export async function createMsg(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateMessageReqBody
  >,
  res: Response<CreateMessageResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const savedMsg = await chatService.createMsg({
      userUUID: req.session.authenticatedUser!.uuid!,
      userId: req.session.authenticatedUser!.id,
      message: req.body.message,
    });

    res.status(201).json({ results: savedMsg });
  } catch (err) {
    next(err);
  }
}
