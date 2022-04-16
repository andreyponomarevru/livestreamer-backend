import { Router } from "express";

import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import {
  jsonContentTypeSchema,
  updateBroadcastSchema,
  idSchema,
} from "../../config/validation-schemas";
import { validate } from "../../middlewares/validate";
import { readAllPublished } from "./read-all-published";
import { readAllHidden } from "./read-all-hidden";
import { updatePublished } from "./update-published";
import { softDestroy } from "./soft-destroy";
import { updateHidden } from "./update-hidden";
import { destroy } from "./destroy";
import { bookmark } from "./bookmark-broadcast";
import { unbookmark } from "./unbookmark-broadcast";

const router = Router();

router.get("/broadcasts", readAllPublished);

router.patch(
  "/broadcasts/:id",
  isAuthenticated,
  isAuthorized("update_partially", "broadcast"),
  validate(idSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  updatePublished,
);

router.delete(
  "/broadcasts/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast"),
  validate(idSchema, "params"),
  softDestroy,
);

router.post(
  "/broadcasts/:id/bookmark",
  isAuthenticated,
  isAuthorized("create", "user_own_bookmarks"),
  validate(idSchema, "params"),
  bookmark,
);

router.delete(
  "/broadcasts/:id/bookmark",
  isAuthenticated,
  isAuthorized("delete", "user_own_bookmarks"),
  validate(idSchema, "params"),
  unbookmark,
);

router.get(
  "/broadcasts/drafts",
  isAuthenticated,
  isAuthorized("read", "broadcast_draft"),
  readAllHidden,
);

router.patch(
  "/broadcasts/drafts/:id",
  isAuthenticated,
  isAuthorized("update_partially", "broadcast_draft"),
  validate(idSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  updateHidden,
);

router.delete(
  "/broadcasts/drafts/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast_draft"),
  validate(idSchema, "params"),
  destroy,
);

export { router as broadcastsRouter };
