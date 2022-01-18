import { jest, describe, it, expect } from "@jest/globals";

import { HTTP_ERRORS } from "./../../src/config/constants";
import { HttpError } from "../../src/utils/http-error";

describe("HttpError class", () => {
  describe("constructor", () => {
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    it("returns new HTTP error instance", () => {
      const code = 404;
      const err = new HttpError({ code });

      expect(err.status).toBe(code);
      expect(err.statusText).toBe(HTTP_ERRORS[code]);
      expect(err.moreInfo).toMatch(urlRegex);
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
