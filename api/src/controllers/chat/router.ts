import Joi from "joi";
import express from "express";
import { jsonContentTypeSchema, idSchema } from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { chatController } from "./controller";

export const chatRouter = express.Router();

chatRouter.get(
  "/messages",
  validate(
    Joi.object({
      next_cursor: Joi.string().base64().min(1).max(100).optional(),
      limit: Joi.number().integer().positive().min(1).max(50).optional(),
    }),
    "query",
  ),
  chatController.readMsgsPaginated,
);

chatRouter.post(
  "/messages",
  isAuthenticated,
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.object({
      message: Joi.string().min(1).max(500).required().messages({
        "string.base": `'message' should be a type of 'string'`,
        "string.empty": `'message' cannot be an empty string`,
        "any.required": `'message' is required`,
      }),
    }),
    "body",
  ),
  chatController.createMsg,
);

chatRouter.delete(
  "/messages/:id",
  isAuthenticated,
  isAuthorized("delete", "user_own_chat_message"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  chatController.destroyOwnMsg,
);

chatRouter.post(
  "/messages/:id/like",
  isAuthenticated,
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  chatController.likeMsg,
);

chatRouter.delete(
  "/messages/:id/like",
  isAuthenticated,
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  chatController.unlikeMsg,
);
