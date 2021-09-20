import util from "util";

import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { logger } from "../../config/logger";

export function validate(
  schema: Joi.ObjectSchema<any>,
  location: "body" | "headers" | "query" | "params",
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await schema.validateAsync(req[location]);
      req[location] = { ...req[location], ...validated };

      logger.debug(`${__filename}: ${util.inspect(req[location])}`);
    } catch (err) {
      next(err);
    }

    next();
  };
}
