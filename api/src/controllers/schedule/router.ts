import Joi from "joi";
import express from "express";
import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { validate } from "../../middlewares/validate";
import { jsonContentTypeSchema, idSchema } from "../validation-schemas-common";
import { scheduleController } from "./controller";

export const scheduleRouter = express.Router();

scheduleRouter.get("/", scheduleController.readAllScheduledBroadcasts);

scheduleRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("create", "scheduled_broadcast"),
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.object({
      title: Joi.string().trim().min(5).max(70).required(),
      startAt: Joi.date().iso().required().messages({
        "date.format":
          "'startAt' timestamp is in invalid format, string should be in ISO-8601",
      }),
      endAt: Joi.date().iso().required().messages({
        "date.format":
          "'endAt' timestamp is in invalid format, string should be in ISO-8601",
      }),
    }),
    "body",
  ),
  scheduleController.createScheduledBroadcast,
);

scheduleRouter.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("delete", "scheduled_broadcast"),
  validate(Joi.object({ id: idSchema }).required().unknown(true), "params"),
  scheduleController.destroyScheduledBroadcast,
);
