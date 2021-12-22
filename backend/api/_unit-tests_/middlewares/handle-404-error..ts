import { Request, Response } from "express";
import { jest, describe, it, expect } from "@jest/globals";

import { handle404Error } from "../../src/middlewares/handle-404-error";
import { HttpError } from "../../src/utils/http-error";

jest.mock("../../src/utils/http-error");

describe("handle404Error middleware", () => {
  it("forwards 404 error to the next middleware", () => {
    // Arrange
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    // Act
    handle404Error(req, res, next);

    // Assert
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(new HttpError({ code: 404 }));
  });
});
