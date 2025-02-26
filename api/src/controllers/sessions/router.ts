import Joi from "joi";
import express from "express";
import {
  jsonContentTypeSchema,
  emailSchema,
  usernameSchema,
  passwordSchema,
} from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { sessionController } from "./controller";

export const sessionRouter = express.Router();

sessionRouter.post(
  "/",
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.alternatives()
      .try(
        Joi.object({ email: emailSchema, password: passwordSchema }),
        Joi.object({ username: usernameSchema, password: passwordSchema }),
      )
      .match("one")
      .messages({
        "alternatives.any": `Invalid email, username or password`,
      }),
    "body",
  ),
  sessionController.createSession,
);

sessionRouter.delete("/", isAuthenticated, sessionController.destroySession);
