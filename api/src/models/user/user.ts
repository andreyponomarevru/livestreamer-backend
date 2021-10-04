import { SanitizedUser } from "../../types";

export class User {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: string;
  lastLoginAt: string;
  readonly isEmailConfirmed: boolean;
  readonly isDeleted: boolean;
  readonly permissions: { [key: string]: string[] };

  constructor(profile: {
    id: number;
    email: string;
    username: string;
    password: string;
    createdAt: string;
    lastLoginAt: string;
    isEmailConfirmed: boolean;
    isDeleted: boolean;
    permissions: { [key: string]: string[] };
  }) {
    this.id = profile.id;
    this.email = profile.email;
    this.username = profile.username;
    this.password = profile.password;
    this.createdAt = profile.createdAt;
    this.lastLoginAt = profile.lastLoginAt;
    this.isEmailConfirmed = profile.isEmailConfirmed;
    this.isDeleted = profile.isDeleted;
    this.permissions = profile.permissions;
  }

  get sanitized(): SanitizedUser {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      permissions: this.permissions,
    };
  }
}
