import { jest, describe, it, beforeEach, expect } from "@jest/globals";

import {
  onServerUpgrade,
  onServerError,
} from "../../src/event-handlers/http-server";

describe("onServerError event handler", () => {
  it.todo("throws an error if the syscall that failed is not 'listen'");

  it.todo("exit process with error if exit code is EACCES");

  it.todo("log error if exit code is EACCES");

  it.todo("exit process with error if exit code is EADDRINUSE");

  it.todo("log error if exit code is EADDRINUSE");

  it.todo("throw an error if it is of unknown type");
});

describe("onServerUpgrade", () => {
  it.todo("calls session parser");

  it.todo("adds ws client to the store even if he is not authenticated");
});
