import { Permissions, Profile } from "../../types";

export class User {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly createdAt: string;
  readonly lastLoginAt: string;
  readonly isEmailConfirmed: boolean;
  readonly isDeleted: boolean;
  readonly permissions: Permissions;

  constructor(profile: {
    id: number;
    email: string;
    username: string;
    createdAt: string;
    lastLoginAt: string;
    isEmailConfirmed: boolean;
    isDeleted: boolean;
    permissions: Permissions;
  }) {
    this.id = profile.id;
    this.email = profile.email;
    this.username = profile.username;
    this.createdAt = profile.createdAt;
    this.lastLoginAt = profile.lastLoginAt;
    this.isEmailConfirmed = profile.isEmailConfirmed;
    this.isDeleted = profile.isDeleted;
    this.permissions = profile.permissions;
  }
}
