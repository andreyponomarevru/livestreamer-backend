import { describe, it } from "@jest/globals";

describe("validate", () => {
  describe("if the validation has failed", () => {
    it.todo("validates");
    it.todo("throws and catches an error");
    it.todo("calls the next middleware with an error");
  });

  describe("if the validation has succeeded", () => {
    it.todo("calls the next middleware");
  });
});
