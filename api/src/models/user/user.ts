import { type Permissions } from "../../types";

interface UserProfile {
  uuid: string;
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
  permissions: Permissions;
}

export class User {
  uuid: string;
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: string;
  lastLoginAt?: string;
  readonly isEmailConfirmed: boolean;
  readonly isDeleted: boolean;
  readonly permissions: Permissions;

  constructor(profile: UserProfile) {
    this.uuid = profile.uuid;
    this.id = profile.id;
    this.email = profile.email;
    this.username = profile.username;
    this.password = profile.password;
    this.createdAt = profile.createdAt;
    this.isEmailConfirmed = profile.isEmailConfirmed;
    this.isDeleted = profile.isDeleted;
    this.permissions = profile.permissions;

    if (profile.lastLoginAt) this.lastLoginAt = profile.lastLoginAt;
  }
}
