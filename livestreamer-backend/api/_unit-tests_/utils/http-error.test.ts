import { jest, describe, it, expect } from "@jest/globals";

import { HTTP_ERRORS } from "./../../src/config/constants";
import { HttpError } from "../../src/utils/http-error";

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

describe("HttpError class", () => {
  it("returns new HTTP error", () => {
    const CODE = 404;
    const err = new HttpError({ code: CODE });

    expect(err).toBeInstanceOf(HttpError);
    expect(err.status).toBe(CODE);
    expect(err.statusText).toBe(HTTP_ERRORS[CODE]);
    expect(err.moreInfo).toMatch(urlRegex);
  });

  it("includes error message in HTTP error if it is passed", () => {
    const err = new HttpError({
      code: 404,
      message: "Confirmation token is invalid",
    });

    expect(typeof err.message).toBe("string");
  });
});
