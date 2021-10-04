import path from "path";

import express from "express";
import cors from "cors";
import morganLogger from "morgan";

import session from "express-session";

import { HTTP_PORT } from "./config/env";
import { morganSettings, logger } from "./config/logger";
import { handleErrors } from "./controllers/middlewares/handle-errors";
import { handle404Error } from "./controllers/middlewares/handle-404-error";
import { router } from "./controllers/index";

import * as env from "./config/env";
import { sess } from "./config/session-storage";

const expressApp = express();
expressApp.set("port", HTTP_PORT);
// If the Node app is behind a proxy (like Nginx), we have to set
// proxy to true (more specifically to 'trust first proxy')
if (env.NODE_ENV === "production") expressApp.set("trust proxy", 1);
// Save in var in order to use it for WebSocket Upgrade request authentication:
const sessionParser = session(sess);

expressApp.use((req, res, next) => {
  logger.debug(req.headers);
  next();
});
expressApp.use(sessionParser);
expressApp.use(morganLogger("combined", morganSettings));
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use("/api/v1", router);
// If request doesn't match the routes above, it is past to 404 error handler
expressApp.use(handle404Error);
expressApp.use(handleErrors);

export { expressApp, sessionParser };
