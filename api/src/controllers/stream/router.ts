import Joi from "joi";
import express from "express";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import { validate } from "../../middlewares/validate";
import { streamController } from "./controller";

export const streamRouter = express.Router();

streamRouter.get("/", streamController.pull);

streamRouter.put(
  "/",
  isAuthenticated,
  isAuthorized("create", "audio_stream"),
  validate(
    Joi.object({
      "content-type": Joi.string().required().valid("audio/mpeg").messages({
        "string.base": `'content-type' should be a type of 'string'`,
        "string.empty": `'content-type' cannot be an empty string`,
        "any.required": `'content-type' is required`,
      }),
    })
      .required()
      .unknown(true),
    "headers",
  ),
  streamController.push,
);

streamRouter.put("/like", isAuthenticated, streamController.likeStream);
