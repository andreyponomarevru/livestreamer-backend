import { Request, Response, NextFunction } from "express";

import { HttpError } from "../utils/http-error";
import { User } from "../models/user/user";

declare module "express-session" {
  interface SessionData {
    authenticatedUser: User;
  }
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.session && req.session.authenticatedUser) {
    next();
  } else {
    next(
      new HttpError({
        code: 401,
        message: "You must authenticate to access this resource",
      }),
    );
  }
}
