import { Request, Response, NextFunction } from "express";
import { chatService } from "../../services/chat/service";

export const moderationController = {
  destroyAnyMsg: async function (
    req: Request<
      { id?: number },
      Record<string, unknown>,
      Record<string, unknown>,
      { user_id?: number }
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await chatService.destroyMsg({
        userUUID: req.session.authenticatedUser!.uuid!,
        userId: req.query.user_id as unknown as number,
        id: req.params.id as number,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
