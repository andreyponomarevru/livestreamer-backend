import path from "path";
import express from "express";
import cors from "cors";
import morganLogger from "morgan";
import session from "express-session";
import { HTTP_PORT } from "./config/env";
import { morganSettings, logger } from "./config/logger";
import { handleErrors } from "./middlewares/handle-errors";
import { handle404Error } from "./middlewares/handle-404-error";
import * as env from "./config/env";
import { sessionConfig } from "./config/session-storage";
import { apiRouter } from "./controllers/router";

const expressApp = express();
expressApp.set("port", HTTP_PORT);
// If the Node app is behind a proxy (like Nginx), we have to set
// proxy to true (more precisely to 'trust first proxy')
if (env.NODE_ENV === "production") {
  expressApp.set("trust proxy", 1);
}
// Save in var in order to use it for WebSocket Upgrade request authentication:
const sessionParser = session(sessionConfig);

expressApp.use(cors());
expressApp.use(sessionParser);
expressApp.use((req, res, next) => {
  logger.debug(req.headers);
  next();
});
expressApp.use(morganLogger("combined", morganSettings));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use("/", apiRouter);
// If request doesn't match the routes above, it is past to 404 error handler
expressApp.use(handle404Error);
expressApp.use(handleErrors);

export { expressApp, sessionParser };
