import { describe, it, expect, beforeEach } from "@jest/globals";
import { faker } from "@faker-js/faker";
import {
  encodeNextPageCursor,
  decodeNextPageCursor,
} from "./handle-db-cursors";

const dbRecordTimestamp = faker.date.past().toISOString();
const dbRecordId = faker.number.int();

describe("decodeNextPageCurso", function () {
  it("returns decoded cursor if valid cursor has been passed", () => {
    const decodedCursor = {
      timestampCursor: dbRecordTimestamp,
      idCursor: dbRecordId,
    };
    const encodedCursor = encodeNextPageCursor(dbRecordTimestamp, dbRecordId);

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

describe("encodeNextPageCursor", function () {
  let encodedCursor: string;

  beforeEach(() => {
    encodedCursor = encodeNextPageCursor(dbRecordTimestamp, dbRecordId);
  });

  it("returns encoded cursor as a valid base64 string", () => {
    const base64Chars = /[A-Za-z0-9+/=]/;

    expect(typeof encodedCursor).toBe("string");
    expect(encodedCursor).toMatch(base64Chars);
  });

  it("encodes to valid base64", () => {
    expect(() =>
      Buffer.from(encodedCursor, "base64").toString("ascii"),
    ).not.toThrow();
  });
});
