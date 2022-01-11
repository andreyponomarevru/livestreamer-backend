import { describe, it, expect, beforeEach } from "@jest/globals";
import faker from "faker";

import {
  encodeNextPageCursor,
  decodeNextPageCursor,
} from "../../src/utils/handle-db-cursors";

const DB_RECORD_TIMESTAMP = new Date().toISOString();
const DB_RECORD_ID = faker.datatype.number();

describe("decodeNextPageCursor function", function () {
  it("returns decoded cursor if valid cursor has been passed", () => {
    const decodedCursor = {
      timestampCursor: DB_RECORD_TIMESTAMP,
      idCursor: DB_RECORD_ID,
    };
    const encodedCursor = encodeNextPageCursor(
      DB_RECORD_TIMESTAMP,
      DB_RECORD_ID,
    );

    expect(decodedCursor).toStrictEqual(decodeNextPageCursor(encodedCursor));
  });

  it("returns an object containing 'undefined' values if no argument has been passed", function () {
    const decodedCursor = decodeNextPageCursor();

    expect(decodedCursor).toStrictEqual({
      timestampCursor: undefined,
      idCursor: undefined,
    });
  });

  it("throws an error if invalid cursor has been passed", () => {
    expect(() => decodeNextPageCursor("abc")).toThrow();
  });

  it("throws an error if empty string has been passed", () => {
    expect(() => decodeNextPageCursor("")).toThrow();
  });
});

describe("encodeNextPageCursor function", function () {
  let encodedCursor: string;

  beforeEach(() => {
    encodedCursor = encodeNextPageCursor(DB_RECORD_TIMESTAMP, DB_RECORD_ID);
  });

  it("returns encoded cursor as valid base64 string", () => {
    expect(typeof encodedCursor).toBe("string");
  });

  it("encodes to valid base64", () => {
    expect(() =>
      Buffer.from(encodedCursor, "base64").toString("ascii"),
    ).not.toThrow();
  });
});
