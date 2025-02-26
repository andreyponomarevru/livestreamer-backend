import Joi from "joi";
import express from "express";
import { idSchema } from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { moderationController } from "./controller";

export const moderationRouter = express.Router();

moderationRouter.delete(
  "/chat/messages/:id",
  isAuthenticated,
  isAuthorized("delete", "any_chat_message"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  validate(Joi.object({ user_id: idSchema }).optional().unknown(true), "query"),
  moderationController.destroyAnyMsg,
);
