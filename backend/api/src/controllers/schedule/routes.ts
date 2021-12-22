import { Router } from "express";

import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { validate } from "../../middlewares/validate";
import {
  jsonContentTypeSchema,
  scheduleSchema,
  idSchema,
} from "../../config/validation-schemas";
import { createScheduledBroadcast } from "./create-scheduled-broadcast";
import { readAllScheduledBroadcasts } from "./read-all-scheduled-broadcasts";
import { destroyScheduledBroadcast } from "./destroy-scheduled-broadcast";

const router = Router();

router.get("/schedule", readAllScheduledBroadcasts);

router.post(
  "/schedule",
  isAuthenticated,
  isAuthorized("create", "scheduled_broadcast"),
  validate(jsonContentTypeSchema, "headers"),
  validate(scheduleSchema, "body"),
  createScheduledBroadcast,
);

router.delete(
  "/schedule/:id",
  isAuthenticated,
  isAuthorized("delete", "scheduled_broadcast"),
  validate(idSchema, "params"),
  destroyScheduledBroadcast,
);

export { router as scheduleRouter };
