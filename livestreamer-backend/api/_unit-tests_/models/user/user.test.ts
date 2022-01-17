process.env.NODE_ENV = "test"; // supress logging

import { describe, it, expect } from "@jest/globals";
import faker from "faker";

import { v4 as uuidv4 } from "uuid";

import { User } from "../../src/models/user/user";
import { Permissions } from "../../src/config/constants";

const UUID = uuidv4();
const ID = faker.datatype.number();
const EMAIL = faker.internet.exampleEmail();
const USERNAME = faker.internet.userName();
const PASSWORD = faker.internet.password();
const CREATED_AT = String(faker.date.past());
const IS_EMAIL_CONFIRMED = faker.datatype.boolean();
const IS_DELETED = faker.datatype.boolean();
const PERMISSIONS = { broadcast: [faker.datatype.string()] } as Permissions;
const LAST_LOGIN_AT = String(faker.date.past());

describe("User class", () => {
  it("returns new user", () => {
    const USER: User = {
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
    const user = new User(USER);

    expect(user).toBeInstanceOf(User);
    expect(user.uuid).toBe(USER.uuid);
    expect(user.id).toBe(USER.id);
    expect(user.email).toBe(USER.email);
    expect(user.username).toBe(USER.username);
    expect(user.password).toBe(USER.password);
    expect(user.createdAt).toBe(USER.createdAt);
    expect(user.isEmailConfirmed).toBe(USER.isEmailConfirmed);
    expect(user.isDeleted).toBe(USER.isDeleted);
    expect(user.permissions).toStrictEqual(USER.permissions);
  });

  it("sets the last login date if it is provided", () => {
    const USER: User = {
      uuid: UUID,
      id: ID,
      email: EMAIL,
      username: USERNAME,
      password: PASSWORD,
      createdAt: CREATED_AT,
      isEmailConfirmed: IS_EMAIL_CONFIRMED,
      isDeleted: IS_DELETED,
      permissions: PERMISSIONS,
      lastLoginAt: LAST_LOGIN_AT,
    };
    const user = new User(USER);

    expect({ ...user }).toStrictEqual({ ...USER });
  });

  it("doesn't set the last login date if it is not provided", () => {
    const USER: User = {
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
    const user = new User(USER);

    expect(user.lastLoginAt).toBe(undefined);
  });
});
