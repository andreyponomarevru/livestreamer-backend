import { Router } from "express";
import swaggerUI from "swagger-ui-express";

import { swaggerDocument } from "./../open-api/index";
import { parseBasicAuthorizationHeader } from "./middlewares/parse-basic-authorization-header";
import { isAuthenticated } from "./middlewares/is-authenticated";
import { isAuthorized } from "./middlewares/is-authorized";
import * as sessionsController from "./sessions";
import * as chatController from "./chat";
import * as usersController from "./users";
import * as broadcastsController from "./broadcasts";
import * as scheduleController from "./schedule";
import * as streamController from "./stream";

import {
  basicAuthZHeaderSchema,
  userIdSchema,
  emailSchema,
  tokenSchema,
  updatePasswordSchema,
  jsonContentTypeSchema,
  sessionSchema,
  usernameObjectSchema,
  scheduleSchema,
  updateBroadcastSchema,
  idSchema,
  audioContentTypeSchema,
  paginationSchema,
  chatMsgSchema,
  destroyChatMsgSchema,
} from "../config/validation-schemas";
import { validate } from "./middlewares/validate";

const router = Router();

// AuthN

// TODO: add .get("/sessions") to retrieve a list of all logged in users

router.post(
  "/sessions",
  validate(jsonContentTypeSchema, "headers"),
  validate(sessionSchema, "body"),
  sessionsController.createSession,
);
router.delete("/sessions", isAuthenticated, sessionsController.destroySession);
router.post(
  "/verification",
  validate(tokenSchema, "query"),
  usersController.confirmUserSignUp,
);

// Admin

router.get(
  "/admin/users",
  isAuthenticated,
  isAuthorized("read", "all_user_accounts"),
  usersController.readAllUsers,
);
router.delete(
  "/admin/chat/messages/:id",
  isAuthenticated,
  isAuthorized("delete", "any_chat_message"),
  validate(idSchema, "params"),
  validate(destroyChatMsgSchema, "query"),
  chatController.destroyAnyMsg,
);

// Users

router.post(
  "/user",
  parseBasicAuthorizationHeader,
  validate(basicAuthZHeaderSchema, "headers"),
  validate(emailSchema, "body"),
  usersController.createUser,
);
router.get("/user", isAuthenticated, usersController.readUser);
router.patch(
  "/user",
  isAuthenticated,
  isAuthorized("update_partially", "user_own_account"),
  validate(jsonContentTypeSchema, "headers"),
  validate(usernameObjectSchema, "body"),
  usersController.updateUser,
);
router.delete(
  "/user",
  isAuthenticated,
  isAuthorized("delete", "user_own_account"),
  usersController.destroyUser,
);
router.patch(
  "/user/settings/password",
  validate(jsonContentTypeSchema, "headers"),
  validate(updatePasswordSchema, "body"),
  usersController.updatePassword,
);

// Schedule

router.get("/schedule", scheduleController.readAllScheduledBroadcasts);
router.post(
  "/schedule",
  isAuthenticated,
  isAuthorized("create", "scheduled_broadcast"),
  validate(jsonContentTypeSchema, "headers"),
  validate(scheduleSchema, "body"),
  scheduleController.createScheduledBroadcast,
);
router.delete(
  "/schedule/:id",
  isAuthenticated,
  isAuthorized("delete", "scheduled_broadcast"),
  validate(idSchema, "params"),
  scheduleController.destroyScheduledBroadcast,
);

// Broadcast

router.get("/broadcasts", broadcastsController.readAllPublished);
router.get(
  "/user/broadcasts/bookmarked",
  isAuthenticated,
  broadcastsController.readAllBookmarked,
);
router.patch(
  "/broadcasts/:id",
  isAuthenticated,
  isAuthorized("update_partially", "broadcast"),
  validate(idSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  broadcastsController.updatePublished,
);
router.delete(
  "/broadcasts/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast"),
  validate(idSchema, "params"),
  broadcastsController.softDestroy,
);
router.post(
  "/broadcasts/:id/bookmark",
  isAuthenticated,
  isAuthorized("create", "user_own_bookmarks"),
  validate(idSchema, "params"),
  broadcastsController.bookmark,
);
router.delete(
  "/broadcasts/:id/bookmark",
  isAuthenticated,
  isAuthorized("delete", "user_own_bookmarks"),
  validate(idSchema, "params"),
  broadcastsController.unbookmark,
);

router.get(
  "/broadcasts/drafts",
  isAuthenticated,
  isAuthorized("read", "broadcast_draft"),
  broadcastsController.readAllHidden,
);
router.patch(
  "/broadcasts/drafts/:id",
  isAuthenticated,
  isAuthorized("update_partially", "broadcast_draft"),
  validate(idSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  broadcastsController.updateHidden,
);
router.delete(
  "/broadcasts/drafts/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast_draft"),
  validate(idSchema, "params"),
  broadcastsController.destroy,
);

// Stream

router.get("/stream", streamController.pull);
router.put(
  "/stream",
  isAuthenticated,
  isAuthorized("create", "audio_stream"),
  validate(audioContentTypeSchema, "headers"),
  streamController.push,
);
router.put("/stream/like", isAuthenticated, broadcastsController.like);

// Chat

router.get(
  "/chat/messages",
  validate(paginationSchema, "query"),
  chatController.readMsgsPaginated,
);
router.post(
  "/chat/messages",
  isAuthenticated,
  validate(jsonContentTypeSchema, "headers"),
  validate(chatMsgSchema, "body"),
  chatController.createMsg,
);

router.delete(
  "/chat/messages/:id",
  isAuthenticated,
  isAuthorized("delete", "user_own_chat_message"),
  validate(idSchema, "params"),
  chatController.destroyOwnMsg,
);
router.post(
  "/chat/messages/:id/like",
  isAuthenticated,
  validate(idSchema, "params"),
  chatController.likeMsg,
);
router.delete(
  "/chat/messages/:id/like",
  isAuthenticated,
  validate(idSchema, "params"),
  chatController.unlikeMsg,
);

// Doc

router.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export { router };
