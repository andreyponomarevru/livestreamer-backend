import { APP_NAME } from "../config/env";
import { getUsers } from "./get-users";
import { postUser } from "./post-user";
import { postSession } from "./post-session";
import { deleteSession } from "./delete-session";
import { patchPasswordUpdate } from "./patch-password-reset";
import { getUser } from "./get-user";
import { deleteUser } from "./delete-user";
import { patchUser } from "./patch-user";
import { getSettings } from "./get-settings";
import { patchSettings } from "./patch-settings";
import { getBookmarks } from "./get-bookmarks";
import { postBookmark } from "./post-bookmark";
import { deleteBookmark } from "./delete-bookmark";
import { getBroadcasts } from "./get-broadcasts";
import { postBroadcast } from "./post-broadcast";
import { getBroadcast } from "./get-broadcast";
import { patchBroadcast } from "./patch-broadcast";
import { deleteBroadcast } from "./delete-broadcast";
import { postBroadcastLike } from "./post-broadcast-like";
import { getStream } from "./get-stream";
import { postStream } from "./post-stream";
import { getChatComments } from "./get-chat-comments";
import { postChatComment } from "./post-chat-comment";
import { deleteChatComment } from "./delete-chat-comment";
import { postChatCommentLike } from "./post-chat-comment-like";
import { deleteChatCommentLike } from "./delete-chat-comment-like";
import { postSchedule } from "./post-schedule";
import { getSchedule } from "./get-schedule";
import { deleteSchedule } from "./delete-schedule";
import { getTracklist } from "./get-tracklist";
import { postTracklist } from "./post-tracklist";
import { putTracklist } from "./put-tracklist";
import { postEmailConfirmation } from "./post-email-confirmation";

// Spec: https://swagger.io/specification/

export const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: `${APP_NAME} API Doc`,
    description: `Documentation for ${APP_NAME} API`,
    contact: {
      name: "Andrey Ponomarev",
      email: "info@andreyponomarev.ru",
      url: "https://andreyponomarev.ru",
    },
  },
  servers: [{ url: "localhost:8000/api/v1", description: "Local server" }],
  paths: {
    "/stream": { get: getStream, post: postStream },

    "/sessions": { post: postSession, delete: deleteSession },

    "/verification": { post: postEmailConfirmation },

    "/users": { get: getUsers, post: postUser },
    "/users/{id}": { get: getUser, patch: patchUser, delete: deleteUser },
    "/users/settings/password": { patch: patchPasswordUpdate },
    // TODO: currently I don't implement this route for simplicity sake. Also, for consistency it's better to exclcude the '../{userId}/..' from the route
    // "/users/{userId}/settings": { get: getSettings, patch: patchSettings },
    "/users/{id}/bookmarks": {
      get: getBookmarks,
      post: postBookmark,
      delete: deleteBookmark,
    },

    "/schedule": { get: getSchedule, post: postSchedule },
    "/schedule/:scheduledBroadcastId": { delete: deleteSchedule },

    "/broadcasts": { get: getBroadcasts, post: postBroadcast },
    "/broadcasts/{id}": {
      get: getBroadcast,
      patch: patchBroadcast,
      delete: deleteBroadcast,
    },
    "/broadcasts/{id}/tracklist": {
      get: getTracklist,
      post: postTracklist,
      put: putTracklist,
    },
    "/broadcasts/{id}/like": { put: postBroadcastLike },

    "/chat-comments": { get: getChatComments, post: postChatComment },
    "/chat-comments/{id}": { delete: deleteChatComment },
    "/chat-comments/{id}/like": {
      post: postChatCommentLike,
      delete: deleteChatCommentLike,
    },
  },

  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "SESSIONID" },
      basicAuth: { type: "http", scheme: "basic" },
    },

    schemas: {
      //
      // App Objects
      //

      Permissions: {
        type: "object",
        properties: {
          userProfiles: { type: "array", items: { type: "string" } },
          userProfile: { type: "array", items: { type: "string" } },
          userSettings: { type: "array", items: { type: "string" } },
          userBookmarks: { type: "array", items: { type: "string" } },
          broadcasts: { type: "array", items: { type: "string" } },
          broadcast: { type: "array", items: { type: "string" } },
          broadcastTracklist: { type: "array", items: { type: "string" } },
          streamLike: { type: "array", items: { type: "string" } },
          stream: { type: "array", items: { type: "string" } },
          chatComments: { type: "array", items: { type: "string" } },
          chatComment: { type: "array", items: { type: "string" } },
          chatCommentLike: { type: "array", items: { type: "string" } },
        },
      },

      UserAccount: {
        type: "object",
        required: [
          "id",
          "username",
          "email",
          "createdAt",
          "lastLoginAt",
          "isConfirmed",
          "isDeleted",
          "permissions",
        ],
        properties: {
          id: { type: "number" },
          username: { type: "string" },
          email: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          lastLoginAt: { type: "string", format: "date-time" },
          isConfirmed: { type: "boolean" },
          isDeleted: { type: "boolean" },
          permissions: { $ref: "#/components/schemas/Permissions" },
        },
      },

      UserProfile: {
        type: "object",
        required: ["id", "username", "email", "permissions"],
        properties: {
          id: { type: "number" },
          username: { type: "string" },
          email: { type: "string" },
          permissions: { $ref: "#/components/schemas/Permissions" },
        },
      },

      ScheduledBroadcast: {
        type: "object",
        required: ["title", "startAt", "endAt"],
        properties: {
          id: { type: "nunber" },
          title: { type: "string" },
          startAt: { type: "string" },
          endAt: { type: "string" },
        },
      },

      Broadcast: {
        type: "object",
        required: [
          "id",
          "title",
          "startAt",
          "endAt",
          "listenerPeakCount",
          "isVisible",
          "likesCount",
        ],
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          description: { type: "string" },
          startAt: { type: "string" },
          endAt: { type: "string" },
          listenerPeakCount: { type: "string" },
          downloadUrl: { type: "string" },
          listenUrl: { type: "string" },
          isVisible: { type: "boolean" },
          likesCount: { type: "number" },
        },
      },

      ChatComment: {
        type: "object",
        properties: {
          id: { type: "number" },
          userId: { type: "number" },
          username: { type: "string" },
          createdAt: { type: "string" },
          message: { type: "string" },
        },
      },

      Error: {
        type: "object",
        properties: {
          status: { type: "number" },
          message: { type: "string" },
          moreInfo: { type: "string" },
        },
      },

      //
      // Request/Response Object
      //

      CreateSessionRequest: {
        type: "object",
        properties: { email: { type: "string" } },
      },

      GetPasswordResetTokenRequest: {
        type: "object",
        properties: {
          email: { type: "string" },
        },
      },

      SaveNewPasswordRequest: {
        type: "object",
        properties: {
          token: { type: "string" },
          newPassword: { type: "string" },
        },
      },

      CreateUserRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string" },
          roleName: { type: "number" },
          isConfirmed: { type: "boolean" },
          permissions: { $ref: "#/components/schemas/Permissions" },
        },
      },

      UpdateUserRequest: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
          email: { type: "string" },
          isConfirmed: { type: "boolean" },
          isDeleted: { type: "boolean" },
          permissions: { $ref: "#/components/schemas/Permissions" },
        },
      },

      ScheduleBroadcastRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          startAt: { type: "string" },
          endAt: { type: "string" },
        },
      },

      SaveBroadcastRequest: {
        type: "object",
        required: [
          "title",
          "start_at",
          "end_at",
          "listenerPeakCount",
          "likesCount",
        ],
        properties: {
          title: { type: "string" },
          startAt: { type: "string" },
          endAt: { type: "string" },
          topListenerCount: { type: "string" },
          likes: { type: "number" },
        },
      },

      UpdateBroadcastRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          downloadUrl: { type: "string" },
          listenLink: { type: "string" },
          isVisible: { type: "boolean" },
        },
      },

      CreateBookmarkRequest: {
        type: "object",
        properties: {
          broadcastId: { type: "number" },
        },
      },

      CreateOrUpdateTracklistRequest: {
        type: "object",
        properties: {
          tracklist: { type: "string", format: "binary" },
        },
      },

      CreateChatCommentRequest: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
