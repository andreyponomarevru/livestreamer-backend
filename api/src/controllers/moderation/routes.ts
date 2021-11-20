import { Router } from "express";

import { idSchema } from "../../config/validation-schemas";
import { validate } from "../../middlewares/validate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { destroyChatMsgSchema } from "../../config/validation-schemas";
import { destroyAnyMsg } from "./destroy-any-message";

const router = Router();

router.delete(
  "/moderation/chat/messages/:id",
  isAuthenticated,
  isAuthorized("delete", "any_chat_message"),
  validate(idSchema, "params"),
  validate(destroyChatMsgSchema, "query"),
  destroyAnyMsg,
);

export { router as moderationRouter };
