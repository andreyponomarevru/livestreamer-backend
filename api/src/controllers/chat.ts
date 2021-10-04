import { Request, Response, NextFunction } from "express";

import * as chatService from "../services/chat/chat";
import { wsServer } from "./../ws-server";
import { User } from "../models/user/user";
import * as authzService from "../services/authz/authz";
import chatEvents from "./../services/chat/chat-events";
import { ChatMsg, ChatMsgId, ChatMsgLike, ChatMsgUnlike } from "../types";

// Events are triggered in service layer

function onCreateChatMsg(msg: ChatMsg) {
  wsServer.sendToAllExceptSender(
    { event: "chat:createmessage", data: msg },
    msg.userId,
  );
}
function onDestroyChatMsg(msg: ChatMsgId) {
  wsServer.sendToAllExceptSender(
    { event: "chat:deletemessage", data: msg },
    msg.userId,
  );
}
function onLikeChatMsg(like: ChatMsgLike) {
  wsServer.sendToAllExceptSender(
    { event: "chat:likemessage", data: like },
    like.likedByUserId,
  );
}
function onUnlikeChatMsg(unlike: ChatMsgUnlike) {
  wsServer.sendToAllExceptSender(
    { event: "chat:unlikemessage", data: unlike },
    unlike.unlikedByUserId,
  );
}
chatEvents.on("createmessage", onCreateChatMsg);
chatEvents.on("deletemessage", onDestroyChatMsg);
chatEvents.on("likemessage", onLikeChatMsg);
chatEvents.on("unlikemessage", onUnlikeChatMsg);

export async function createMsg(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const savedMsg = await chatService.createMsg({
      userId: req.session.authenticatedUser!.id,
      message: String(req.body.message),
    });

    res.status(201);
    res.json({ results: savedMsg });
  } catch (err) {
    next(err);
  }
}

export async function readMsgsPaginated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const limit =
      typeof req.query.limit === "number" ? Number(req.query.limit) : 50;
    const nextCursor =
      typeof req.query.next_cursor === "string"
        ? req.query.next_cursor
        : undefined;

    const msgs = await chatService.readMsgsPaginated({ limit, nextCursor });

    res.status(200);
    res.json({ results: msgs });
  } catch (err) {
    next(err);
  }
}
/*
function isAuthorized(action: string, resource: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const user = req.session.authenticatedUser!;

    let hasPermission = false;

    hasPermission = await authzService.isAllowed(user, action, "chat_message");

    if (hasPermission) next();
    else res.status(403).end();
  };
}
isAuthorized("delete", "chat_message");
hasObjectPermission();

There are two cases we need to handle to answere the question 

* "isAllowed to delete 'any_chat_message'?" > delete > 204
* "isAllowed to delete 'user_own_chat_message"? 
  > Yes > isUserIdMatch?
  > No > 403
*/

export async function destroyMsg(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // TODO: this should be invoked after authZ
    await chatService.destroyMsg({
      userId: req.session.authenticatedUser!.id,
      id: Number(req.params.id),
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function likeMsg(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // TODO: this should be invoked after authZ
    await chatService.likeMsg({
      id: Number(req.params.id),
      userId: req.session.authenticatedUser!.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function unlikeMsg(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // TODO: this should be invoked after authZ
    await chatService.unlikeMsg({
      id: Number(req.params.id),
      userId: req.session.authenticatedUser!.id,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
