import { Router } from "express";

import swaggerUI from "swagger-ui-express";

import { swaggerDocument } from "./../../open-api/index";

const router = Router();

router.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export { router as docRouter };
