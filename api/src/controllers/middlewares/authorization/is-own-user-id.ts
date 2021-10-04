import { Request } from "express";

export function isOwnUserId(req: Request): boolean {
  if (!req.session.authenticatedUser) return false;
  if (req.session.authenticatedUser.id !== Number(req.params.userId))
    return false;

  return true;
}
