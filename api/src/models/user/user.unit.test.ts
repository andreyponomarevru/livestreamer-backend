import { describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user";
import { type Permissions } from "../../types";

describe("User class", () => {
  const uuid = uuidv4();
  const id = faker.number.int();
  const email = faker.internet.exampleEmail();
  const username = faker.internet.username();
  const password = faker.internet.password();
  const createdAt = faker.date.past().toISOString();
  const isEmailConfirmed = faker.datatype.boolean();
  const isDeleted = faker.datatype.boolean();
  const permissions = { broadcast: [faker.string.sample()] } as Permissions;
  const lastLoginAt = faker.date.past().toISOString();

  it("returns a new user instance", () => {
    const USER: User = {
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
    const user = new User(USER);

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
      uuid,
      id,
      email,
      username,
      password,
      createdAt,
      isEmailConfirmed,
      isDeleted,
      permissions,
      lastLoginAt,
    };
    const user = new User(USER);

    expect({ ...user }).toStrictEqual({ ...USER });
  });

  it("doesn't set the last login date if it is not provided", () => {
    const USER: User = {
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
    const user = new User(USER);

    expect(user.lastLoginAt).toBe(undefined);
  });
});
