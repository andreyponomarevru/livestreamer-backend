import { describe, it, beforeEach, expect } from "@jest/globals";

import { v4 as uuidv4 } from "uuid";

import { User } from "../../src/models/user/user";
import { Permissions } from "../../src/config/constants";
import { sanitizeUser } from "../../src/models/user/sanitize-user";

describe("sanitizeUser function", () => {
  let user: User;
  const UUID = uuidv4();
  const ID = 1;
  const EMAIL = "info@test.ru";
  const USERNAME = "test";
  const PASSWORD = "1234";
  const CREATED_AT = new Date().toISOString();
  const IS_EMAIL_CONFIRMED = true;
  const IS_DELETED = false;
  const PERMISSIONS = { broadcast: ["read"] } as Permissions;
  const LAST_LOGIN_AT = new Date().toISOString();

  beforeEach(() => {
    user = {
      uuid: UUID,
      id: ID,
      email: EMAIL,
      username: USERNAME,
      password: PASSWORD,
      createdAt: CREATED_AT,
      isEmailConfirmed: IS_EMAIL_CONFIRMED,
      isDeleted: IS_DELETED,
      permissions: PERMISSIONS,
    };
  });

  it("returns sanitized user", () => {
    expect(sanitizeUser(user)).toStrictEqual({
      uuid: UUID,
      id: ID,
      email: EMAIL,
      username: USERNAME,
      permissions: PERMISSIONS,
    });
  });
});
