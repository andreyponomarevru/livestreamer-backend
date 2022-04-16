import { Router } from "express";

import { tokenSchema } from "../../config/validation-schemas";
import { validate } from "../../middlewares/validate";
import { confirmUserSignUp } from "./confirm-sign-up";

const router = Router();

router.post("/verification", validate(tokenSchema, "query"), confirmUserSignUp);

export { router as verificationRouter };
