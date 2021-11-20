import { Router } from "express";

import {
  jsonContentTypeSchema,
  sessionSchema,
} from "../../config/validation-schemas";
import { validate } from "../../middlewares/validate";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { createSession } from "./create-session";
import { destroySession } from "./destroy-session";

const router = Router();

// TODO: add .get("/sessions") to retrieve a list of all logged in users

router.post(
  "/sessions",
  validate(jsonContentTypeSchema, "headers"),
  validate(sessionSchema, "body"),
  createSession,
);

router.delete("/sessions", isAuthenticated, destroySession);

export { router as sessionsRouter };
