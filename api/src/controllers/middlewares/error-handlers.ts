import util from "util";

import { Request, Response, NextFunction } from "express";
import { ValidationError as JoiValidationError } from "joi";

import { HttpError } from "./http-errors/HttpError";
import { logger } from "../../config/logger";

//
// Error handlers
//

// Forward 404 errors to Express custom error handler
export function on404error(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Error 404 forwarded to Express custom error handler`);
  next(new HttpError(404));
}

// Express custom error handler
// - handle errors passed to next() handler
// - handle errors thrown inside route handler
export function expressCustomErrorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Express Custom Error Handler\n${util.inspect(err)}`);

  if (err instanceof HttpError) {
    res.status(err.errorCode);
    res.json(err);
  } else if (err instanceof JoiValidationError) {
    res.status(400);
    res.json(
      new HttpError(400, err.details.map((err) => err.message).join("; ")),
    );
  } else {
    res.status(500);
    res.json(new HttpError(500));
    throw err;
  }
}
