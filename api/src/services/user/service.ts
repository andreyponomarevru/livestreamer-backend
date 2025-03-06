import { SignUpData, Permissions } from "../../types";
import { User } from "../../models/user/user";
import { authnService } from "../authn";
import { mailService } from "../mail";
import { userRepo } from "../../models/user/queries";
import { EXCHANGE_NAME, QUEUES } from "../../config/rabbitmq/config";
import { rabbitMQPublisher } from "../../config/rabbitmq/publisher";

export const userService = {
  createUser: async function (signupData: SignUpData): Promise<void> {
    const userToken = authnService.generateToken();

    const { userId } = await userRepo.createUser({
      username: signupData.username,
      email: signupData.email,
      password: await authnService.hashPassword(signupData.password),
      roleId: signupData.roleId,
      emailConfirmationToken: userToken,
      isEmailConfirmed: signupData.isEmailConfirmed,
    });

    await rabbitMQPublisher.sendMsgToQueue({
      queue: QUEUES.confirmSignUpEmail.queue,
      exchange: EXCHANGE_NAME,
      routingKey: QUEUES.confirmSignUpEmail.routingKey,
      content: Buffer.from(
        JSON.stringify(
          mailService.emailTemplates.createSignUpConfirmationEmail({
            username: signupData.username,
            email: signupData.email,
            userId: userId,
            userToken: userToken,
          }),
        ),
      ),
    });
  },

  readUser: async function (userId: number): Promise<User> {
    return await userRepo.readUser(userId);
  },

  readAllUsers: async function (): Promise<User[]> {
    return await userRepo.readAllUsers();
  },

  updateUser: async function ({
    userId,
    username,
  }: {
    userId: number;
    username: string;
  }): Promise<{
    uuid: string;
    id: number;
    email: string;
    username: string;
    permissions: Permissions;
  }> {
    return await userRepo.updateUser({ userId, username });
  },

  destroyUser: async function (userId: number): Promise<void> {
    await userRepo.destroyUser(userId);
  },

  isUserExists: async function ({
    userId,
    username,
    email,
  }: {
    userId?: number;
    username?: string;
    email?: string;
  }): Promise<boolean> {
    return await userRepo.isUserExists({ userId, username, email });
  },

  isUserDeleted: async function ({
    userId,
    email,
  }: {
    userId?: number;
    email?: string;
  }): Promise<boolean> {
    return await userRepo.isUserDeleted({ userId, email });
  },

  updatePassword: async function ({
    userId,
    newPassword,
  }: {
    userId: number;
    newPassword: string;
  }): Promise<void> {
    const hash = await authnService.hashPassword(newPassword);
    await userRepo.updatePassword({ userId, newPassword: hash });
  },

  updateLastLoginTime: async function (userId: number): Promise<{
    lastLoginAt: string;
  }> {
    return await userRepo.updateLastLoginTime(userId);
  },

  isEmailConfirmed: async function ({
    userId,
    email,
  }: {
    userId?: number;
    email?: string;
  }): Promise<boolean> {
    return await userRepo.isEmailConfirmed({ userId, email });
  },

  findByUsernameOrEmail: async function ({
    username,
    email,
  }: {
    username?: string;
    email?: string;
  }): Promise<User | null> {
    return await userRepo.findByUsernameOrEmail({ username, email });
  },

  findByEmailConfirmationToken: async function (token: string): Promise<{
    userId: number | null;
  }> {
    return await userRepo.findByEmailConfirmationToken(token);
  },

  findByPasswordResetToken: async function (token: string): Promise<{
    userId: number | null;
  }> {
    return await userRepo.findByPasswordResetToken(token);
  },
};
