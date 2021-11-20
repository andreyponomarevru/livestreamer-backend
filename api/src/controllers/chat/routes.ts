import { Router } from "express";

import {
  jsonContentTypeSchema,
  idSchema,
  paginationSchema,
  chatMsgSchema,
} from "../../config/validation-schemas";
import { readMsgsPaginated } from "./read-messages-paginated";
import { validate } from "../../middlewares/validate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { createMsg } from "./create-message";
import { destroyOwnMsg } from "./destroy-message";
import { likeMsg } from "./like-message";
import { unlikeMsg } from "./unlike-message";

const router = Router();

router.get(
  "/chat/messages",
  validate(paginationSchema, "query"),
  readMsgsPaginated,
);

router.post(
  "/chat/messages",
  isAuthenticated,
  validate(jsonContentTypeSchema, "headers"),
  validate(chatMsgSchema, "body"),
  createMsg,
);

router.delete(
  "/chat/messages/:id",
  isAuthenticated,
  isAuthorized("delete", "user_own_chat_message"),
  validate(idSchema, "params"),
  destroyOwnMsg,
);

router.post(
  "/chat/messages/:id/like",
  isAuthenticated,
  validate(idSchema, "params"),
  likeMsg,
);

router.delete(
  "/chat/messages/:id/like",
  isAuthenticated,
  validate(idSchema, "params"),
  unlikeMsg,
);

export { router as chatRouter };
