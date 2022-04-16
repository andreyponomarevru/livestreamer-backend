import { Router } from "express";

import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import { readAllUsers } from "./read-all-users";

const router = Router();

router.get(
  "/users",
  isAuthenticated,
  isAuthorized("read", "all_user_accounts"),
  readAllUsers,
);

export { router as usersRouter };
