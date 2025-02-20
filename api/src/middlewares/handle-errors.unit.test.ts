import { describe, it } from "@jest/globals";

describe("handleErrors", () => {
  describe("if the error is an instance of HttpError", () => {
    it.todo("");
  });

  describe("if the error is an instance of Joi.ValidationError", () => {});

  describe("if the error code matches the PostgreSQL error", () => {});

  it.todo(
    "responds with an error matching the error.status if the error.status is set",
  );

  it.todo("responds with the 500 error if the error.status is not set");
});
