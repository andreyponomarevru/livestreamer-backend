import util from "util";

import { Request, Response, NextFunction } from "express";
import { ValidationError as JoiValidationError } from "joi";

import { HttpError } from "../../utils/http-errors/http-error";
import { logger } from "../../config/logger";
import { ServiceError } from "../../utils/service-error";

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
    res.status(err.statusCode);
    res.json(err);
  } else if (err instanceof JoiValidationError) {
    res.status(400);
    res.json(
      new HttpError(400, err.details.map((err) => err.message).join("; ")),
    );
  } else if (err instanceof ServiceError) {
    switch (err.name) {
      case "dublicate_user":
        res.status(409);
        res.json(new HttpError(409, err.message));
    }
  } else {
    if (err.statusCode) {
      res.status(err.statusCode);
      res.json(new HttpError(err.statusCode));
    } else {
      res.status(500);
      res.json(new HttpError(500));
    }
  }
}
