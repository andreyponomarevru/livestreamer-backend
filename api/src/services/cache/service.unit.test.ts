import { describe, it } from "@jest/globals";

describe("cacheService", () => {
  describe("saveWithTTL", () => {
    it.todo("returns 'OK' is the data has been successfully saved");
    it.todo("sets the expiration time");
  });

  describe("get", () => {
    it.todo("returns the saved data as a valid JavaScript object");
    it.todo("if the response is empty, throws an error");
  });
});
