import express from "express";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import { usersController } from "./controller";

export const usersRouter = express.Router();

usersRouter.get(
  "/",
  isAuthenticated,
  isAuthorized("read", "all_user_accounts"),
  usersController.readAllUsers,
);
