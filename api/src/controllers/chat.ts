import { Request, Response, NextFunction } from "express";

import { HttpError } from "../utils/http-error";
import * as chatService from "../services/chat/chat";
import { ChatMsg } from "../types";

type CreateMessageReqBody = { message: string };
type CreateMessageResBody = { results: ChatMsg };
type CursorPaginationReqQuery = {
  next_cursor?: string;
  limit?: number;
};
type CursorPaginationResBody = {
  results: {
    nextCursor: string | null;
    messages: ChatMsg[];
  };
};
type DestroyAnyMsgQuery = { id?: number };
type DestroyAnyMsgParams = { user_id?: number };
type DestroyOwnMsgReqParams = { id?: number };
type LikeMsgParams = { id?: number };
type UnlikeMsgParams = { id?: number };

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
