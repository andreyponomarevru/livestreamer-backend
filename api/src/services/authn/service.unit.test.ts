import { describe, it } from "@jest/globals";

describe("authnService", () => {
  describe("confirmEmail", () => {
    it.todo("updates the user in db setting his email as 'confirmed'");
    it.todo("creates a welcome email");
    it.todo("sends the welcome email");
  });

  describe("handlePasswordReset", () => {
    it.todo("generates a new token");
    it.todo("saves the token and the corresponding email to the db");
    it.todo("creates the password-reset email");
    it.todo("sends the password-reset email");
  });

  describe("hashPassword", () => {
    it.todo("returns the salted and hashed version of the password");
  });

  describe("isPasswordMatch", () => {
    it.todo("returns true if the password matches its hashed version");
    it.todo("returns false if the passwords doesn't match its hashed version");

    it.todo("returns false if the error is thrown while comparing passwords");
    it.todo("doesn't throw if the password doesn't match its hashed versions");
  });

  describe("generateToken", () => {
    it.todo("generates and returns a new token");
  });
});
