import Joi from "joi";
import express from "express";
import { validate } from "../../middlewares/validate";
import { verificationController } from "./controller";

export const verificationRouter = express.Router();

verificationRouter.post(
  "/",
  validate(
    Joi.object({
      token: Joi.string().required().messages({
        "string.base": `Token value should be a type of 'string'`,
        "string.empty": `Token value cannot be an empty string`,
        "any.required": `Token value is required`,
      }),
    })
      .required()
      .unknown(true),
    "query",
  ),
  verificationController.confirmUserSignUp,
);
