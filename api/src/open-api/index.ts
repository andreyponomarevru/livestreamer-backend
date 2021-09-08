import { APP_NAME } from "../config/env";
import { getUsers } from "./get-users";
import { postUser } from "./post-user";
import { postSession } from "./post-session";
import { deleteSession } from "./delete-session";
import { postPasswordReset } from "./post-password-reset";
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
import { postStreamLike } from "./post-stream-like";
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
    "/session": { post: postSession, delete: deleteSession },

    "/passsword-reset": { post: postPasswordReset },

    "/users": { get: getUsers, post: postUser },
    "/users/{userId}": { get: getUser, patch: patchUser, delete: deleteUser },
    // TODO: to keep the things simple, currently I skip this route
    // "/users/{userId}/settings": { get: getSettings, patch: patchSettings },
    //"/users/{userId}/settings/password": {
    // TODO: implement the password reset:
    // post: postUserSettingsPassword - send new password to this route — NO! Better send PATCH request with only 'password' property in json object to /users/:id,
    // consider also this route:
    // /users/{userId}/settings/password/reset
    // https://gist.github.com/nasrulhazim/c9b5e2ae414ff3c004c388c485e4cb80
    //},
    "/users/{userId}/bookmarks": {
      get: getBookmarks,
      post: postBookmark,
      delete: deleteBookmark,
    },

    "/schedule": { get: getSchedule, post: postSchedule },
    "/schedule/:scheduledBroadcastId": { delete: deleteSchedule },

    "/broadcasts": { get: getBroadcasts, post: postBroadcast },
    "/broadcasts/{broadcastId}": {
      get: getBroadcast,
      patch: patchBroadcast,
      delete: deleteBroadcast,
    },
    "/broadcast/{broadcastId}/tracklist": {
      get: getTracklist,
      post: postTracklist,
      put: putTracklist,
    },

    "/stream/like": { put: postStreamLike },
    "/stream": { get: getStream, post: postStream },

    "/chat-comments": { get: getChatComments, post: postChatComment },
    "/chat-comments/{chatCommentId}": { delete: deleteChatComment },
    "/chat-comments/{chatCommentId}/like": {
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
      // App Objects

      Permissions: {
        type: "object",
        properties: {
          user_profiles: { type: "array", items: { type: "string" } },
          user_profile: { type: "array", items: { type: "string" } },
          user_settings: { type: "array", items: { type: "string" } },
          user_bookmarks: { type: "array", items: { type: "string" } },
          broadcasts: { type: "array", items: { type: "string" } },
          broadcast: { type: "array", items: { type: "string" } },
          broadcast_tracklist: { type: "array", items: { type: "string" } },
          stream_like: { type: "array", items: { type: "string" } },
          stream: { type: "array", items: { type: "string" } },
          chat_comments: { type: "array", items: { type: "string" } },
          chat_comment: { type: "array", items: { type: "string" } },
          chat_comment_like: { type: "array", items: { type: "string" } },
        },
      },

      UserAccount: {
        type: "object",
        required: [
          "id",
          "username",
          "email",
          "created_at",
          "last_login_at",
          "is_confirmed",
          "is_deleted",
          "permissions",
        ],
        properties: {
          id: { type: "number" },
          username: { type: "string" },
          email: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          last_login_at: { type: "string", format: "date-time" },
          is_confirmed: { type: "boolean" },
          is_deleted: { type: "boolean" },
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
        required: ["title", "start_at", "end_at"],
        properties: {
          id: { type: "nunber" },
          title: { type: "string" },
          start_at: { type: "string" },
          end_at: { type: "string" },
        },
      },

      Broadcast: {
        type: "object",
        required: [
          "id",
          "title",
          "start_at",
          "end_at",
          "top_listener_count",
          "is_visible",
          "likes",
        ],
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          description: { type: "string" },
          start_at: { type: "string" },
          end_at: { type: "string" },
          top_listener_count: { type: "string" },
          download_url: { type: "string" },
          player_html: { type: "string" },
          is_visible: { type: "boolean" },
          likes: { type: "number" },
        },
      },

      ChatComment: {
        type: "object",
        properties: {
          id: { type: "number" },
          user_id: { type: "number" },
          username: { type: "string" },
          created_at: { type: "string" },
          message: { type: "string" },
        },
      },

      Error: {
        type: "object",
        properties: {
          status: { type: "number" },
          message: { type: "string" },
          more_info: { type: "string" },
        },
      },

      // Request/Response Object

      // username + password passed in Authorization header
      CreateSessionRequest: {
        type: "object",
        properties: { email: { type: "string" } },
      },

      ResetPasswordRequest: {
        type: "object",
        properties: {
          email: { type: "string" },
        },
      },

      CreateUserRequest: {
        type: "object",
        required: ["email", "username", "password"],
        properties: {
          email: { type: "string" },
          username: { type: "string" },
          password: { type: "string" },
          role_name: { type: "number" },
          is_confirmed: { type: "boolean" },
          permissions: { $ref: "#/components/schemas/Permissions" },
        },
      },

      UpdateUserRequest: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
          email: { type: "string" },
          is_confirmed: { type: "boolean" },
          is_deleted: { type: "boolean" },
          permissions: { $ref: "#/components/schemas/Permissions" },
        },
      },

      ScheduleBroadcastRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          start_at: { type: "string" },
          end_at: { type: "string" },
        },
      },

      SaveBroadcastRequest: {
        type: "object",
        required: [
          "title",
          "start_at",
          "end_at",
          "top_listener_count",
          "likes",
        ],
        properties: {
          title: { type: "string" },
          start_at: { type: "string" },
          end_at: { type: "string" },
          top_listener_count: { type: "string" },
          likes: { type: "number" },
        },
      },

      UpdateBroadcastRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          download_url: { type: "string" },
          player_html: { type: "string" },
          is_visible: { type: "boolean" },
        },
      },

      CreateBookmarkRequest: {
        type: "object",
        properties: {
          broadcast_id: { type: "number" },
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
