import { Request, Response, NextFunction } from "express";

import * as chatService from "../../services/chat/chat";
import { ChatMsg } from "../../types";

type CursorPaginationReqQuery = { next_cursor?: string; limit?: number };
type CursorPaginationResBody = {
  results: { nextCursor: string | null; messages: ChatMsg[] };
};

export async function readMsgsPaginated(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    CursorPaginationReqQuery
  >,
  res: Response<CursorPaginationResBody>,
  next: NextFunction,
): Promise<void> {
  try {
    const limit = req.query.limit || 50;
    const nextCursor = req.query.next_cursor;

    const msgs = await chatService.readMsgsPaginated(limit, nextCursor);
  
    res.status(200).json({ results: msgs });
  } catch (err) {
    next(err);
  }
}
