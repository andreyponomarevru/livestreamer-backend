import { Router } from "express";

import { parseBasicAuthorizationHeader } from "../../middlewares/parse-basic-authorization-header";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import {
  basicAuthZHeaderSchema,
  emailSchema,
  updatePasswordSchema,
  jsonContentTypeSchema,
  usernameObjectSchema,
} from "../../config/validation-schemas";
import { validate } from "../../middlewares/validate";
import { createUser } from "./create-user";
import { readUser } from "./read-user";
import { updatePassword } from "./update-password";
import { destroyUser } from "./destroy-user";
import { updateUser } from "./update-user";
import { readAllBookmarkedBroadcasts } from "./read-all-bookmarked-broadcasts";

const router = Router();

router.post(
  "/user",
  parseBasicAuthorizationHeader,
  validate(basicAuthZHeaderSchema, "headers"),
  validate(emailSchema, "body"),
  createUser,
);

router.get("/user", isAuthenticated, readUser);

router.patch(
  "/user",
  isAuthenticated,
  isAuthorized("update_partially", "user_own_account"),
  validate(jsonContentTypeSchema, "headers"),
  validate(usernameObjectSchema, "body"),
  updateUser,
);

router.delete(
  "/user",
  isAuthenticated,
  isAuthorized("delete", "user_own_account"),
  destroyUser,
);

router.patch(
  "/user/settings/password",
  validate(jsonContentTypeSchema, "headers"),
  validate(updatePasswordSchema, "body"),
  updatePassword,
);

router.get(
  "/user/broadcasts/bookmarked",
  isAuthenticated,
  readAllBookmarkedBroadcasts,
);

export { router as userRouter };
