import { describe, it, expect } from "@jest/globals";

import {
  encodeNextPageCursor,
  decodeNextPageCursor,
} from "../src/utils/handle-db-cursors";

const DB_RECORD_TIMESTAMP = new Date(
  "December 17, 1995 03:24:00",
).toISOString();
const DB_RECORD_ID = 1;
const ENCODED_NEXT_CURSOR = "MTk5NS0xMi0xN1QwMDoyNDowMC4wMDBaLDE=";

describe("Handle database cursors", () => {
  describe("decodeNextPageCursor function", function () {
    it("returns an object containing db record's timestamp and id", function () {
      expect(decodeNextPageCursor(ENCODED_NEXT_CURSOR)).toStrictEqual({
        timestampCursor: DB_RECORD_TIMESTAMP,
        idCursor: 1,
      });
    });

    it("returns an object containing 'undefined' values if no argument has been passed", function () {
      expect(decodeNextPageCursor()).toStrictEqual({
        timestampCursor: undefined,
        idCursor: undefined,
      });
    });

    it("throws an error if invalid argument has been passed", () => {
      expect(() => decodeNextPageCursor("MTk")).toThrow();
    });

    it("throws an error if empty string has been passed", () => {
      expect(() => decodeNextPageCursor("")).toThrow();
    });
  });

  describe("encodeNextPageCursor function", function () {
    it("returns encoded cursor as a string", function () {
      expect(encodeNextPageCursor(DB_RECORD_TIMESTAMP, DB_RECORD_ID)).toEqual(
        ENCODED_NEXT_CURSOR,
      );
    });
  });
});
