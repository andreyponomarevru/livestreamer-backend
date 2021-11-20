import { Router } from "express";

import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import { audioContentTypeSchema } from "../../config/validation-schemas";
import { validate } from "../../middlewares/validate";
import { likeStream } from "./like-stream";
import { pull } from "./pull-stream";
import { push } from "./push-stream";

const router = Router();

router.get("/stream", pull);

router.put(
  "/stream",
  isAuthenticated,
  isAuthorized("create", "audio_stream"),
  validate(audioContentTypeSchema, "headers"),
  push,
);

router.put("/stream/like", isAuthenticated, likeStream);

export { router as streamRouter };
