import { Request, Response } from "express";
import { jest, describe, it, expect } from "@jest/globals";

import { isAuthenticated } from "../../src/middlewares/is-authenticated";
import type { HttpError } from "../../src/utils/http-error";

describe("isAuthenticated middleware", () => {
  const httpError = {
    message: expect.any(String),
    moreInfo: expect.any(String),
    status: 401,
    statusText: expect.any(String),
  } as unknown as HttpError;

  it("calls the next function with an error, if session doesn't exist", async () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await isAuthenticated(req, res, next);

    expect(next).toBeCalledWith(httpError);
  });

  it("calls the next function with an error, if the session doesn't contain the authenticated user data", async () => {
    const req = { session: {} } as Request;
    const res = {} as Response;
    const next = jest.fn();

    await isAuthenticated(req, res, next);

    expect(next).toBeCalledWith(httpError);
  });

  it("calls the next function with no arguments, if there is a session and it contains the authenticated user data", async () => {
    const req = { session: { authenticatedUser: {} } } as Request;
    const res = {} as Response;
    const next = jest.fn();

    await isAuthenticated(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next.mock.calls[0].length).toBe(0);
  });
});
