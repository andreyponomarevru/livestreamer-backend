import util from "util";

import { Request, Response, NextFunction } from "express";

import { logger } from "../config/logger";

export function parseBasicAuthorizationHeader(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.headers.authorization) {
    const [schema = "", credentials = ""] =
      req.headers.authorization.split(" ");

    const parsedCredentials = Buffer.from(credentials, "base64").toString();

    const [username = "", password = ""] = parsedCredentials.split(":");

    req.headers.basicauth = { schema, username, password };

    logger.debug(`${__filename}: ${util.inspect(req.headers.basicauth)}`);
  }

  next();
}
