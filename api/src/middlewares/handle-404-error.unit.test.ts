import { Request, Response } from "express";
import { jest, describe, it, expect } from "@jest/globals";
import { handle404Error } from "./handle-404-error";
import { moreInfo } from "../../test-helpers/constants";
import { HTTP_ERRORS } from "../config/constants";

describe("handle404Error middleware", () => {
  it("forwards 404 error to the next middleware", () => {
    const next = jest.fn();

    handle404Error({} as Request, {} as Response, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith({
      message: "The requested page does not exist",
      status: 404,
      statusText: HTTP_ERRORS[404],
      ...moreInfo,
    });
  });
});
