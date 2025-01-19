import express from "express";
import swaggerUI from "swagger-ui-express";
import { swaggerDocument } from "./../open-api/index";
import { broadcastsRouter } from "./broadcasts/router";
import { chatRouter } from "./chat/router";
import { moderationRouter } from "./moderation/router";
import { scheduleRouter } from "./schedule/router";
import { streamRouter } from "./stream/router";
import { sessionRouter } from "./sessions/router";
import { verificationRouter } from "./verification/router";
import { userRouter } from "./user/router";
import { usersRouter } from "./users/router";

export const apiRouter = express
  .Router()
  .use("/broadcasts", broadcastsRouter)
  .use("/chat", chatRouter)
  .use("/moderation", moderationRouter)
  .use("/schedule", scheduleRouter)
  .use("/sessions", sessionRouter)
  .use("/stream", streamRouter)
  .use("/user", userRouter)
  .use("/users", usersRouter)
  .use("/verification", verificationRouter)
  .use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
