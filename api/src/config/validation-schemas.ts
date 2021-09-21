import Joi from "joi";

//
// Joi Validation Schemas
//
// Joi props for validation messages: https://github.com/sideway/joi/blob/master/API.md#list-of-errors

export const password = Joi.string().trim().required().min(6).max(50).messages({
  "string.base": `Password should be a type of 'string'`,
  "string.empty": `Password cannot be an empty string`,
  "string.min": `Password is shorter than expected`,
  "string.max": `Password is longer than expected`,
  "any.required": `Password is required`,
});

export const username = Joi.string().trim().required().min(4).max(15).messages({
  "string.base": `Username should be a type of 'string'`,
  "string.empty": `Username cannot be an empty string`,
  "string.min": `Username is shorter than expected`,
  "string.max": `Username is longer than expected`,
  "any.required": `Username is required`,
});

export const email = Joi.string().required().email().messages({
  "string.base": `Email should be a type of 'string'`,
  "string.empty": `Email cannot be an empty string`,
  "string.email": `The string is not a valid e-mail`,
  "any.required": `Email is required`,
});

export const jsonContentType = Joi.string()
  .required()
  .valid("application/json")
  .messages({
    "string.base": `'content-type' should be a type of 'string'`,
    "string.empty": `'content-type' cannot be an empty string`,
    "any.required": `'content-type' is required`,
  });

export const token = Joi.string().required().messages({
  "string.base": `Token value should be a type of 'string'`,
  "string.empty": `Token value cannot be an empty string`,
  "any.required": `Token value is required`,
});

export const idStringSchema = Joi.number()
  .positive()
  .greater(1)
  .required()
  .messages({
    "number.base": `ID should be a type of 'number'`,
    "number.positive": `ID should be positive`,
    "number.greater": `ID should be greater than 1`,
    "any.required": `ID is required`,
  });

//

export const basicAuthZHeaderSchema = Joi.object({
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
      username: username,
      password: password,
    })
    .required()
    .messages({
      "any.required": "Authorization header is required",
    }),
  "content-type": jsonContentType,
})
  .required()
  .unknown(true);

export const jsonContentTypeSchema = Joi.object({
  "content-type": jsonContentType,
})
  .required()
  .unknown(true);

export const emailSchema = Joi.object({
  email: email,
});

export const updatePasswordSchema = Joi.alternatives()
  .try(
    Joi.object({ email: email }),
    Joi.object({ token: token, newPassword: password }),
  )
  .match("one");

export const tokenSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.base": `Token value should be a type of 'string'`,
    "string.empty": `Token value cannot be an empty string`,
    "any.required": `Token value is required`,
  }),
})
  .required()
  .unknown(true);

export const idObjectSchema = Joi.object({ id: idStringSchema })
  .required()
  .unknown(true);

export const usernameObjectSchema = Joi.object({ username: username })
  .required()
  .unknown(true);

/*
import { CreateTrack, UpdateTrack } from "./types";

export const schemaCreateTrack = Joi.object<CreateTrack & UpdateTrack>({
  releaseId: Joi.number().integer().min(1),
  filePath: Joi.string().min(1).max(255).allow(null),
  extension: Joi.string().valid(...SUPPORTED_CODEC),
  artist: Joi.array().items(Joi.string().min(0).max(200)),
  duration: Joi.number().min(0),
  bitrate: Joi.number().min(0).allow(null),
  trackNo: Joi.number().integer().allow(null),
  title: Joi.string().min(0).max(200),
  diskNo: Joi.number().integer().allow(null),
  genre: Joi.array().items(Joi.string()),
}).options({ presence: "required" });

export const schemaUpdateTrack = schemaCreateTrack.keys({
  trackId: Joi.number().min(1).required().required,
});


import { SORT_BY, SORT_ORDER, PER_PAGE_NUMS } from "./constants";
import { FilterParams } from "../types";

export const schemaSort = Joi.object()
  .keys({
    sortBy: Joi.string()
      .valid(...SORT_BY)
      .messages({
        "string.base": `"sort" must be a type of 'string'`,
        "any.only": `"sort" must be one of [${SORT_BY.join(", ")}]`,
        "any.required": `"sort" is required`,
      }),
    sortOrder: Joi.string()
      .valid(...SORT_ORDER)
      .messages({
        "string.base": `"sort" must be a type of 'string'`,
        "any.only": `Sort order in "sort" must be one of [${SORT_ORDER.join(
          ", ",
        )}]`,
        "any.required": `Sort order in "sort" is required`,
      }),
  })
  .options({ presence: "required" });

export const schemaPaginate = Joi.object<{
  page: number;
  itemsPerPage: number;
}>({
  page: Joi.number().integer().min(1).messages({
    "number.base": `"page" must be a type of 'number'`,
    "number.integer": `"page" must be an integer`,
    "number.min": `"page" minimum value is "1"`,
    "any.required": `"page" is required`,
  }),
  itemsPerPage: Joi.number()
    .integer()
    .valid(...PER_PAGE_NUMS)
    .messages({
      "number.base": `"limit" must be a type of 'number'`,
      "number.integer": `"limit" must be an integer`,
      "any.only": `"limit" must be one of [${PER_PAGE_NUMS.join(", ")}]`,
      "any.required": `"limit" is required`,
    }),
}).options({ presence: "required" });

//

export const schemaId = Joi.number().integer().min(1).required().messages({
  "number.base": `"id" must be a type of 'number'`,
  "number.integer": `"id" must be an integer`,
  "number.min": `"id" minimum value is "1"`,
  "any.required": `"id" is required`,
});

export const schemaCatNo = Joi.string().min(1).max(255).required().messages({
  "string.base": `"catNo" must be a type of 'string'`,
  "number.min": `"catNo" min length is 1 symbol`,
  "number.max": `"catNo" max length is 255 symbols`,
  "any.required": `"id" is required`,
});

export const schemaFilterParams = Joi.object<FilterParams>()
  .keys({
    yearIds: Joi.array().items(Joi.number()).allow(null),
    artistIds: Joi.array().items(Joi.number()).allow(null),
    labelIds: Joi.array().items(Joi.number()).allow(null),
    genreIds: Joi.array().items(Joi.number()).allow(null),
  })
  .options({ presence: "required" });

export const schemaSearchQuery = Joi.string()
  .min(2)
  .max(30)
  .lowercase()
  .required();
*/
