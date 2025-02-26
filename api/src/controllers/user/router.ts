import Joi from "joi";
import express from "express";
import { parseBasicAuthorizationHeader } from "../../middlewares/parse-basic-authorization-header";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import {
  jsonContentTypeSchema,
  emailSchema,
  tokenSchema,
  passwordSchema,
  usernameSchema,
} from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { userController } from "./controller";

export const userRouter = express.Router();

userRouter.post(
  "/",
  parseBasicAuthorizationHeader,
  validate(
    Joi.object({
      basicauth: Joi.object()
        .keys({
          schema: Joi.string()
            .trim()
            .required()
            .valid("basic")
            .insensitive()
            .messages({
              "string.base": `Authorization header should be a type of 'string'`,
              "string.empty": `Authorization header cannot be an empty string`,
              "any.only": `Authorization header type must be set to [Basic] authentication scheme`,
              "any.required": `Authorization header is required`,
            }),
          username: usernameSchema,
          password: passwordSchema,
        })
        .required()
        .messages({
          "any.required": "Authorization header is required",
        }),
    })
      .required()
      .unknown(true)
      .concat(jsonContentTypeSchema),
    "headers",
  ),
  validate(Joi.object({ email: emailSchema }).required(), "body"),
  userController.createUser,
);

userRouter.get("/", isAuthenticated, userController.readUser);

userRouter.patch(
  "/",
  isAuthenticated,
  isAuthorized("update_partially", "user_own_account"),
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.object({ username: usernameSchema }).required().unknown(true),
    "body",
  ),
  userController.updateUser,
);

userRouter.delete(
  "/",
  isAuthenticated,
  isAuthorized("delete", "user_own_account"),
  userController.destroyUser,
);

userRouter.patch(
  "/settings/password",
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.alternatives()
      .try(
        Joi.object({ email: emailSchema }),
        Joi.object({ token: tokenSchema, newPassword: passwordSchema }),
      )
      .match("one")
      .messages({ "alternatives.any": `Invalid email or token` }),
    "body",
  ),
  userController.updatePassword,
);

userRouter.get(
  "/broadcasts/bookmarked",
  isAuthenticated,
  userController.readAllBookmarkedBroadcasts,
);
