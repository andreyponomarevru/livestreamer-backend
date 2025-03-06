import { Request, Response } from "express";
import { jest, describe, it, expect } from "@jest/globals";
import { isAuthenticated } from "./is-authenticated";
import { HttpError } from "../utils/http-error";
import { HTTP_ERRORS } from "../config/constants";
import { moreInfo } from "../../test-helpers/helpers";

describe("isAuthenticated", () => {
  const httpError = {
    message: "You must authenticate to access this resource",
    status: 401,
    statusText: HTTP_ERRORS[401],
    ...moreInfo,
  } as unknown as HttpError;

  it("calls the next function with an error, if session doesn't exist", async () => {
    const next = jest.fn();

    await isAuthenticated({} as Request, {} as Response, next);

    expect(next).toBeCalledWith(httpError);
  });

  it("calls the next function with an error, if the session doesn't contain the authenticated user data", async () => {
    const next = jest.fn();

    await isAuthenticated(
      { session: {} } as unknown as Request,
      {} as Response,
      next,
    );

    expect(next).toBeCalledWith(httpError);
  });

  it("calls the next function with no arguments, if there is a session and it contains the authenticated user data", async () => {
    const next = jest.fn();

    await isAuthenticated(
      { session: { authenticatedUser: {} } } as unknown as Request,
      {} as Response,
      next,
    );

    expect(next).toBeCalledTimes(1);
    expect(next.mock.calls[0].length).toBe(0);
  });
});
