import util from "util";

import { Request, Response, NextFunction } from "express";

import { logger } from "../../config/logger";
import { COOKIE_NAME } from "../../config/env";
import * as wsService from "../../services/ws/ws";
import { WSClient } from "../../types";

export async function destroySession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let wsClient: WSClient | undefined;

    if (
      req.session &&
      req.session.authenticatedUser &&
      req.session.authenticatedUser.uuid
    ) {
      wsClient = wsService.clientStore.getClient(
        req.session.authenticatedUser.uuid,
      );
    }

    logger.debug(
      `${__filename} [destroySession] Authenticated user is signing out: `,
      req.session.authenticatedUser,
    );
    logger.debug(
      `${__filename} [destroySession] clients in store: ${util.inspect(
        wsService.clientStore.clients,
      )}`,
    );

    // Handle situation when the client has signed in, but hadn't connected over WS (for example, when the client is 'broadcaster' who connected only over HTTP through CLI)
    if (wsClient) {
      logger.debug(
        `WSClient ${util.inspect(
          wsClient.username,
        )} will be deleted from WSStore`,
      );
    }

    req.session.destroy((err) => {
      // You cannot access session here, it has been already destroyed
      if (err) logger.error(`${__filename}: ${err}`);

      if (wsClient) wsClient.socket.close();
      res.clearCookie(COOKIE_NAME);
      res.status(204).end();

      logger.debug(
        `${__filename}: Session Destroyed! User has been signed out.`,
      );
    });
  } catch (err) {
    next(err);
  }
}
