import path from "path";

import express from "express";
import cors from "cors";
import morganLogger from "morgan";
import session from "express-session";

import { HTTP_PORT } from "./config/env";
import { morganSettings, logger } from "./config/logger";
import { handleErrors } from "./middlewares/handle-errors";
import { handle404Error } from "./middlewares/handle-404-error";
import { chatRouter } from "./controllers/chat/routes";
import { moderationRouter } from "./controllers/moderation/routes";
import { sessionsRouter } from "./controllers/sessions/routes";
import { verificationRouter } from "./controllers/verification/routes";
import { userRouter } from "./controllers/user/routes";
import { docRouter } from "./controllers/doc/routes";
import { usersRouter } from "./controllers/users/routes";
import { scheduleRouter } from "./controllers/schedule/routes";
import { broadcastsRouter } from "./controllers/broadcasts/routes";
import { streamRouter } from "./controllers/stream/routes";
import * as env from "./config/env";
import { sess } from "./config/session-storage";

const expressApp = express();
expressApp.set("port", HTTP_PORT);
// If the Node app is behind a proxy (like Nginx), we have to set
// proxy to true (more precisely to 'trust first proxy')
if (env.NODE_ENV === "prod") expressApp.set("trust proxy", 1);
// Save in var in order to use it for WebSocket Upgrade request authentication:
const sessionParser = session(sess);

expressApp.use(cors());
expressApp.use((req, res, next) => {
  logger.debug(req.headers);
  next();
});
expressApp.use(sessionParser);
expressApp.use(morganLogger("combined", morganSettings));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use("/", chatRouter);
expressApp.use("/", moderationRouter);
expressApp.use("/", sessionsRouter);
expressApp.use("/", verificationRouter);
expressApp.use("/", docRouter);
expressApp.use("/", userRouter);
expressApp.use("/", usersRouter);
expressApp.use("/", broadcastsRouter);
expressApp.use("/", scheduleRouter);
expressApp.use("/", streamRouter);
// If request doesn't match the routes above, it is past to 404 error handler
expressApp.use(handle404Error);
expressApp.use(handleErrors);

export { expressApp, sessionParser };
