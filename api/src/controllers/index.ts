import { Router } from "express";

import swaggerUI from "swagger-ui-express";
import { swaggerDocument } from "./../open-api/index";

import { parseBasicAuthorizationHeader } from "./middlewares/parse-basic-authorization-header";
import { isAuthenticated } from "./middlewares/is-authenticated";
import { isAuthorized } from "./middlewares/authorization/is-authorized";
import { isOwnUserId } from "./middlewares/authorization/is-own-user-id";

import * as sessionsController from "./sessions";
import * as chatController from "./chat";
import * as usersController from "./users";
import * as broadcastsController from "./broadcasts";
import * as scheduleController from "./schedule";
import * as streamController from "./stream";

import {
  basicAuthZHeaderSchema,
  userIdObjectSchema,
  emailSchema,
  tokenSchema,
  updatePasswordSchema,
  jsonContentTypeSchema,
  broadcastIdSchema,
  sessionSchema,
  usernameObjectSchema,
  scheduleSchema,
  updateBroadcastSchema,
  idObjectSchema,
  audioContentTypeSchema,
  paginationSchema,
  chatMsgSchema,
} from "../config/validation-schemas";
import { validate } from "./middlewares/validate";

const router = Router();

router.get("/", (req, res) => {
  res.send("Ola!\n");
});

//
// Doc
//

router.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//
// Auth
//

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

//
// Accounts
//

router.get(
  "/user-management/users",
  isAuthenticated,
  isAuthorized("read", "all_user_accounts"),
  usersController.readAllUsers,
);

//
// Users
//

router.post(
  "/users",
  parseBasicAuthorizationHeader,
  validate(basicAuthZHeaderSchema, "headers"),
  validate(emailSchema, "body"),
  usersController.createUser,
);
router.get(
  "/users/:userId",
  isAuthenticated,
  isAuthorized("read", "user_own_profile", [isOwnUserId]),
  validate(userIdObjectSchema, "params"),
  usersController.readUser,
);
router.patch(
  "/users/:userId",
  isAuthenticated,
  isAuthorized("partially_update", "user_own_account", [isOwnUserId]),
  validate(userIdObjectSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(usernameObjectSchema, "body"),
  usersController.updateUser,
);
router.delete(
  "/users/:userId",
  isAuthenticated,
  isAuthorized("delete", "user_own_account", [isOwnUserId]),
  validate(userIdObjectSchema, "params"),
  usersController.destroyUser,
);
router.patch(
  "/users/settings/password",
  validate(jsonContentTypeSchema, "headers"),
  validate(updatePasswordSchema, "body"),
  usersController.updatePassword,
);

//

router.get(
  "/users/:userId/bookmarks",
  isAuthenticated,
  isAuthorized("read", "user_own_bookmarks", [isOwnUserId]),
  broadcastsController.readAllBookmarked,
);
router.post(
  "/users/:userId/bookmarks",
  isAuthenticated,
  isAuthorized("create", "user_own_bookmarks", [isOwnUserId]),
  validate(jsonContentTypeSchema, "headers"),
  validate(broadcastIdSchema, "body"),
  broadcastsController.bookmark,
);
router.delete(
  "/users/:userId/bookmarks/:broadcastId",
  isAuthenticated,
  isAuthorized("delete", "user_own_bookmarks", [isOwnUserId]),
  broadcastsController.unbookmark,
);

//
// Schedule
//

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
  validate(idObjectSchema, "params"),
  scheduleController.destroyScheduledBroadcast,
);

//
// Broadcast
//

router.get("/broadcasts", broadcastsController.readAllPublished);
router.patch(
  "/broadcasts/:id",
  isAuthenticated,
  isAuthorized("update_partially", "broadcast"),
  validate(idObjectSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  broadcastsController.updatePublished,
);
router.delete(
  "/broadcasts/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast"),
  validate(idObjectSchema, "params"),
  broadcastsController.softDestroy,
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
  validate(idObjectSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(updateBroadcastSchema, "body"),
  broadcastsController.updateHidden,
);
router.delete(
  "/broadcasts/drafts/:id",
  isAuthenticated,
  isAuthorized("delete", "broadcast_draft"),
  validate(idObjectSchema, "params"),
  broadcastsController.destroy,
);

//
// Stream
//
router.put(
  "/stream",
  isAuthenticated,
  isAuthorized("create", "audio_stream"),
  validate(audioContentTypeSchema, "headers"),
  streamController.start,
);
router.get("/stream", streamController.read);
router.put("/stream/like", isAuthenticated, broadcastsController.like);

//
// Chat
//

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
// TODO everyoone who has permission to delete comment should be able to do it (both role superadmin and listener role i.e. author of the comment)
router.delete(
  "/chat/messages/:id",
  isAuthenticated,
  isAuthorized("delete", "user_own_chat_message"),
  validate(idObjectSchema, "params"),
  chatController.destroyMsg,
);
router.post(
  "/chat/messages/:id/like",
  isAuthenticated,
  validate(idObjectSchema, "params"),
  chatController.likeMsg,
);
router.delete(
  "/chat/messages/:id/like",
  isAuthenticated,
  validate(idObjectSchema, "params"),
  chatController.unlikeMsg,
);

export { router };
