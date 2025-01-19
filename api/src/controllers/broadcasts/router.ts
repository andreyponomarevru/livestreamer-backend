import Joi from "joi";
import express from "express";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import { jsonContentTypeSchema, idSchema } from "../validation-schemas-common";
import { updateBroadcastSchema } from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { broadcastController } from "./controller";

export const broadcastsRouter = express.Router();

broadcastsRouter.get("/", broadcastController.readAllPublished);

broadcastsRouter.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("update_partially", "broadcast"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  broadcastController.updatePublished,
);

broadcastsRouter.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  broadcastController.softDestroy,
);

broadcastsRouter.post(
  "/:id/bookmark",
  isAuthenticated,
  isAuthorized("create", "user_own_bookmarks"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  broadcastController.bookmark,
);

broadcastsRouter.delete(
  "/:id/bookmark",
  isAuthenticated,
  isAuthorized("delete", "user_own_bookmarks"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  broadcastController.unbookmark,
);

broadcastsRouter.get(
  "/drafts",
  isAuthenticated,
  isAuthorized("read", "broadcast_draft"),
  broadcastController.readAllHidden,
);

broadcastsRouter.patch(
  "/drafts/:id",
  isAuthenticated,
  isAuthorized("update_partially", "broadcast_draft"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  broadcastController.updateHidden,
);

broadcastsRouter.delete(
  "/drafts/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast_draft"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  broadcastController.destroy,
);
