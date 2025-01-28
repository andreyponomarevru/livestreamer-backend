import { Request, Response } from "express";
import { jest, describe, it, expect } from "@jest/globals";
import { handle404Error } from "./handle-404-error";

describe("handle404Error middleware", () => {
  it("forwards 404 error to the next middleware", () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    handle404Error(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith({
      message: expect.any(String),
      moreInfo: expect.any(String),
      status: 404,
      statusText: expect.any(String),
    });
  });
});
