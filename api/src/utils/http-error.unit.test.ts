import { describe, it, expect } from "@jest/globals";

import { HTTP_ERRORS } from "../config/constants";
import { HttpError } from "./http-error";

describe("HttpError class", () => {
  describe("constructor", () => {
    it("returns new HTTP error instance", () => {
      const code = 404;
      const err = new HttpError({ code });

      expect(err.status).toBe(code);
      expect(err.statusText).toBe(HTTP_ERRORS[code]);
      expect(err.moreInfo).toMatch("https://github.com/ponomarevandrey/");
    });

    it("includes error message, if it is passed", () => {
      const err = new HttpError({
        code: 404,
        message: "Confirmation token is invalid",
      });

      expect(typeof err.message).toBe("string");
    });

    it("doesn't include error message, if it is not passed", () => {
      const err = new HttpError({ code: 404 });

      expect(err.message).toBe(undefined);
    });
  });
});
