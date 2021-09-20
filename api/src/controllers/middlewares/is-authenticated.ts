import { Request, Response, NextFunction } from "express";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (false! /*req.session.authenticatedUser*/) {
    next();
  } else {
    // TODO: return 401/403/...
    res.redirect("login");
  }
}
