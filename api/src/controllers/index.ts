import { Router } from "express";

import swaggerUI from "swagger-ui-express";
import { swaggerDocument } from "./../open-api/index";

import { parseBasicAuthorizationHeader } from "./middlewares/parse-basic-authorization-header";
import { isAuthenticated } from "./middlewares/is-authenticated";

import * as sessionsController from "./sessions";
import * as chatController from "./chat";
import * as usersController from "./users";
import * as broadcastsController from "./broadcasts";
import * as scheduleController from "./schedule";
import * as streamService from "../services/stream/stream";

import {
  basicAuthZHeaderSchema,
  idObjectSchema,
  emailSchema,
  tokenSchema,
  updatePasswordSchema,
  jsonContentTypeSchema,
  idStringSchema,
  usernameObjectSchema,
} from "../config/validation-schemas";
import { validate } from "./middlewares/validate";

const router = Router();

router.get("/", (req, res) => res.send("Ola!\n"));

router.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//
// Users
//

router.get("/users", /*isAuthenticated, */ usersController.readAllUsers);
router.post(
  "/users",
  parseBasicAuthorizationHeader,
  validate(basicAuthZHeaderSchema, "headers"),
  validate(emailSchema, "body"),
  usersController.createUser,
);
router.get(
  "/users/:id",
  validate(idObjectSchema, "params"),
  usersController.readUser,
);
router.patch(
  "/users/:id",
  validate(idObjectSchema, "params"),
  validate(jsonContentTypeSchema, "headers"),
  validate(usernameObjectSchema, "body"),
  usersController.updateUser,
);
router.delete(
  "/users/:id",
  validate(idObjectSchema, "params"),
  usersController.destroyUser,
);

//router.get("/users/:id/bookmarks", usersController.readAllBookmarks);
//router.post("/users/:id/bookmarks", usersController.destroyBookmark);
//router.delete("/users/:id/bookmarks", usersController.createBookmark);
router.patch(
  "/users/settings/password",
  validate(jsonContentTypeSchema, "headers"),
  validate(updatePasswordSchema, "body"),
  usersController.updatePassword,
);

router.post(
  "/verification",
  validate(tokenSchema, "query"),
  usersController.confirmUserSignUp,
);

//
// Auth
//

//router.post("/sessions", sessionsController.createSession);
//router.delete("sessions", sessionsController.destroySession);

//
// Schedule
//

//router.get("/schedule", scheduleController.readAllScheduledBroadcasts);
//router.post("/schedule", scheduleController.createScheduledBroadcast);
//router.delete("/schedule", scheduleController.destroyScheduledBroadcast);

//
// Broadcast
//

//router.get("/broadcasts", broadcastsController.readAllBroadcasts);
//router.post("/broadcasts", broadcastsController.createBroadcast);

//router.get("/broadcasts/:id", broadcastsController.readBroadcast);
//router.patch("/broadcasts/:id", broadcastsController.updateBroadcast);
//router.delete("/broadcasts/id", broadcastsController.destroyBroadcast);

//router.get("/broadcasts/:id/tracklist", broadcastsController.readTracklist);
//router.post("/broadcasts/:id/tracklist", broadcastsController.createTracklist);
//router.put("/broadcasts/:id/tracklist", broadcastsController.updateTracklist);

//router.post("/broadcast/:id/like", broadcastsController.likeBroadcastStream);

//
// Stream
//

//router.put("/stream", /* TODO: authN, authZ */ streamService.push);
//router.get("/stream", streamService.pull);

//
// Chat
//

//router.get("/chat-comments", chatController.readChatCommentsPaginated);
//router.post("/chat-comments", chatController.createChatComment);
//router.delete("/chat-comments", chatController.destroyChatComment);

//router.post("/chat-comments/:id/like", chatController.likeChatComment);
//router.delete("/chat-comments/:id/like", chatController.unlikeChatComment);

export { router };
