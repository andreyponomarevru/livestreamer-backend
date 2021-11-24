import { Request, Response } from "express";
import { jest, describe, it, expect } from "@jest/globals";

import { isAuthenticated } from "../../src/middlewares/is-authenticated";
import { HttpError } from "../../src/utils/http-error";

jest.mock("../../src/utils/http-error");

describe("isAuthenticated middleware", () => {
  it("calls next function with an error, if there is no session", async () => {
    // Arrange
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    // Act
    await isAuthenticated(req, res, next);

    // Assert
    expect(next).toBeCalledWith(new HttpError({ code: 401 }));
  });

  it("calls next function with an error, if there is no authenticatedUser in 'session'", async () => {
    // Arrange
    const req = { session: {} } as Request;
    const res = {} as Response;
    const next = jest.fn();

    // Act
    await isAuthenticated(req, res, next);

    // Assert
    expect(next).toBeCalledWith(new HttpError({ code: 401 }));
  });

  it("calls next function with no arguments, if there is a session and authenticated user object", async () => {
    // Arrange
    const req = { session: { authenticatedUser: {} } } as Request;
    const res = {} as Response;
    const next = jest.fn();

    // Act
    await isAuthenticated(req, res, next);

    // Assert
    expect(next).toBeCalledTimes(1);
    expect(next.mock.calls[0].length).toEqual(0);
  });
});
