import { Request, Response, NextFunction } from "express";

import { HttpError } from "../../utils/http-errors/http-error";
import { User } from "../../models/user/user";

declare module "express-session" {
  interface SessionData {
    authenticatedUser: User;
    liveBroadcastId: number;
  }
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.session.authenticatedUser) {
    next();
  } else {
    throw new HttpError(401);
  }
}
