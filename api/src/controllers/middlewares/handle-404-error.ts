import util from "util";

import { Request, Response, NextFunction } from "express";

import { HttpError } from "../../utils/http-errors/http-error";
import { logger } from "../../config/logger";

// Forward 404 errors to main error handler
export function handle404Error(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Error 404 forwarded to main error handler`);
  logger.error(
    `Request to nonexistent resource:\nheaders:\n${util.inspect(
      req.headers,
    )}\nurl:\n${req.url}\npath:\n${req.path}`,
  );
  next(new HttpError(404));
}
