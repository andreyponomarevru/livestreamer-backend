//import { Request } from "express";
import { jest, describe, it } from "@jest/globals";
//import { HttpError } from "../utils/http-error";
//import { HTTP_ERRORS } from "../config/constants";
//import { moreInfo } from "../../test-helpers/constants";
//import { isAuthorized } from "./is-authorized";

jest.mock("../config/logger");
jest.mock("../utils/http-error");

describe("isAuthorized", () => {
  //const req = { session: { authenticatedUser: {} } } as unknown as Request;

  //isAuthorized("create", "user_account", [(req: Request) => true]);

  describe("if the permission is not granted", () => {
    it.todo("calls 'next' only once");
    it.todo("'next' is called with the 403 error");
  });

  describe("if the permission is granted", () => {
    it.todo("calls 'next' only once if 'extraAuthZ' is empty");

    describe("if 'extraAuthZ' is not empty", () => {});
  });
});
