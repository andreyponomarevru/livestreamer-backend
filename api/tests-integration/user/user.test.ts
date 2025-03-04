import { describe, it } from "@jest/globals";

describe("userService", () => {
  describe("createUser", () => {
    it.todo("generates the token");
    it.todo("saves the user");
    it.todo("creates sign up confirmation email");
    it.todo("sends the sign up confirmation email");
  });

  describe("readUser", () => {
    it.todo("returns the user by id");
  });

  describe("readAllUsers", () => {
    it.todo("returns all existing users");
  });

  describe("updateUser", () => {
    it.todo("updates the user");
  });

  describe("destroyUser", () => {
    it.todo("deletes the user");
  });

  describe("isUserExists", () => {
    it.todo("checks whether the users exists");
    it.todo("returns a boolean");
  });

  describe("isUserDeleted", () => {
    it.todo("checks whether the user has been marked deleted");
    it.todo("returns a boolean");
  });

  describe("updatePassword", () => {
    it.todo("hashes the new password");
    it.todo("updates the password");
  });

  describe("updateLastLoginTime", () => {
    it.todo("updates the last log in time");
    it.todo("returns the last log in time");
  });

  describe("isEmailConfirmed", () => {
    it.todo("checks wther the email has been confirmed");
    it.todo("returns a boolean");
  });

  describe("findByUsernameOrEmail", () => {
    it.todo("returns the user if it has been found");
    it.todo("returns null if the user hasn't been found");
  });

  describe("findByEmailConfirmationToken", () => {
    it.todo(
      "returns the user id by his email confirmation token if it has been found",
    );
    it.todo(
      "returns null if the matching email confirmation token hasn't been found",
    );
  });

  describe("findByPasswordResetToken", () => {
    it.todo(
      "returns the user id by his password reset token if it has been found",
    );
    it.todo(
      "returns null if the matching password reset token hasn't been found",
    );
  });
});
