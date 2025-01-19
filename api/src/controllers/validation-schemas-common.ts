import Joi from "joi";

export const asciiRegex = new RegExp("^[\x00-\x7F]+$");
export const alphaNumericRegex = new RegExp("^[a-zA-Z0-9]+$");

export const passwordSchema = Joi.string()
  .required()
  .min(6)
  .max(50)
  .pattern(asciiRegex)
  .messages({
    "string.base": `Password should be a type of 'string'`,
    "string.empty": `Password cannot be an empty string`,
    "string.min": `Password is shorter than expected`,
    "string.max": `Password is longer than expected`,
    "any.required": `Password is required`,
  });

export const usernameSchema = Joi.string()
  .trim()
  .required()
  .min(3)
  .max(15)
  .pattern(alphaNumericRegex)
  .messages({
    "string.base": `Username should be a type of 'string'`,
    "string.empty": `Username cannot be an empty string`,
    "string.min": `Username is shorter than expected`,
    "string.max": `Username is longer than expected`,
    "any.required": `Username is required`,
  });

export const emailSchema = Joi.string().required().email().messages({
  "string.base": `Email should be a type of 'string'`,
  "string.empty": `Email cannot be an empty string`,
  "string.email": `The string is not a valid e-mail`,
  "any.required": `Email is required`,
});

export const tokenSchema = Joi.string().required().messages({
  "string.base": `Token value should be a type of 'string'`,
  "string.empty": `Token value cannot be an empty string`,
  "any.required": `Token value is required`,
});

export const jsonContentTypeSchema = Joi.object({
  "content-type": Joi.string().required().valid("application/json").messages({
    "string.base": `'content-type' should be a type of 'string'`,
    "string.empty": `'content-type' cannot be an empty string`,
    "any.required": `'content-type' is required`,
  }),
})
  .required()
  .unknown(true);

export const idSchema = Joi.number().positive().greater(0).required().messages({
  "number.base": `ID should be a type of 'number'`,
  "number.positive": `ID should be positive`,
  "number.greater": `ID should be greater than 1`,
  "any.required": `ID is required`,
});

export const updateBroadcastSchema = Joi.object({
  title: Joi.string().trim().min(5).max(70).optional().messages({
    "string.base": `'title' should be a type of 'string'`,
    "string.empty": `'title' cannot be an empty string`,
    "string.min": `'title' is shorter than expected`,
    "string.max": `'title' is longer than expected`,
  }),
  tracklist: Joi.string().trim().max(800).optional().messages({
    "string.base": `'tracklist' should be a type of 'string'`,
    "string.empty": `'tracklist' cannot be an empty string`,
    "string.max": `'tracklist' is longer than expected`,
  }),
  downloadUrl: Joi.string().trim().max(1000).optional().messages({
    "string.base": `'downloadUrl' should be a type of 'string'`,
    "string.empty": `'downloadUrl' cannot be an empty string`,
    "string.max": `'downloadUrl' is longer than expected`,
  }),
  listenUrl: Joi.string().trim().max(1000).optional().messages({
    "string.base": `'listenUrl' should be a type of 'string'`,
    "string.empty": `'listenUrl' cannot be an empty string`,
    "string.max": `'listenUrl' is longer than expected`,
  }),
  listenerPeakCount: Joi.number()
    .positive()
    .integer()
    .min(0)
    .max(50000)
    .optional()
    .messages({
      "number.base": `'listenerPeakCount' should be a type of 'number'`,
      "number.integer": `'listenerPeakCount' must be an integer`,
      "number.positive": `'listenerPeakCount' should be positive`,
      "number.min": `'listenerPeakCount' minimum value is '0'`,
      "number.max": `'listenerPeakCount' max length is 50000 characters`,
    }),
  isVisible: Joi.boolean()
    .optional()
    .messages({ "boolean.base": `'isVisible' should be a type of 'boolean'` }),
  endAt: Joi.date().iso().optional().messages({
    "date.format":
      "'endAt' timestamp is in invalid format, string should be in ISO-8601",
  }),
}).min(1);
