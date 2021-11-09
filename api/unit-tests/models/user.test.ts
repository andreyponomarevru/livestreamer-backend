import { describe, it, beforeEach, expect } from "@jest/globals";

import { v4 as uuidv4 } from "uuid";

import { User } from "../../src/models/user/user";
import { Permissions } from "../../src/config/constants";
import { sanitizeUser } from "../../src/models/user/sanitize-user";

describe("sanitizeUser function", () => {
  let user: User;
  const uuid = uuidv4();
  const id = 1;
  const email = "info@test.ru";
  const username = "test";
  const password = "1234";
  const createdAt = new Date().toISOString();
  const isEmailConfirmed = true;
  const isDeleted = false;
  const permissions = { broadcast: ["read"] } as Permissions;
  const lastLoginAt = new Date().toISOString();

  beforeEach(() => {
    user = {
      uuid,
      id,
      email,
      username,
      password,
      createdAt,
      isEmailConfirmed,
      isDeleted,
      permissions,
    };
  });

  it("returns sanitized user", () => {
    expect(sanitizeUser(user)).toStrictEqual({
      uuid,
      id,
      email,
      username,
      permissions,
    });
  });
});
