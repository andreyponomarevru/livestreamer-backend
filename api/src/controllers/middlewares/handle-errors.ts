import util from "util";

import { Request, Response, NextFunction } from "express";
import { ValidationError as JoiValidationError } from "joi";

import { HttpError } from "../../utils/http-errors/http-error";
import { logger } from "../../config/logger";
import { StreamError } from "../../services/stream/stream-error";

// Main error handler (this is a centralized error handler — all error handling logic is here)
// - handle errors passed to next() handler
// - handle errors thrown inside route handler
// - ...
export function handleErrors(
  err: Error | HttpError | any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Express Custom Error Handler\n${util.inspect(err)}`);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json(err);
  } else if (err instanceof JoiValidationError) {
    res
      .status(400)
      .json(
        new HttpError(400, err.details.map((err) => err.message).join("; ")),
      );
  } else if (err instanceof StreamError && err.name === "STREAM_PAUSED") {
    res.status(404).json(new HttpError(404));
    return;
    // DB errors
  } else if (["23505", "23503"].includes(err.code)) {
    res.status(409).json(new HttpError(409));
  } else {
    if (err.statusCode) {
      res.status(err.statusCode).json(new HttpError(err.statusCode));
    } else {
      res.status(500).json(new HttpError(500));
    }
  }
}
