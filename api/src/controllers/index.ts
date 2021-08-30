import express, { Router } from "express";

import swaggerUI from "swagger-ui-express";
import { swaggerDocument } from "./../open-api/index";

import * as sessions from "./sessions";
import * as stream from "./stream";

const router = Router();

router.post("/sessions", sessions.create);
router.delete("sessions", sessions.destroy);

router.post("/stream", /* TODO: add authN, authZ middlewares */ stream.push);
router.get("/stream", stream.pull);
//router.get("/");
//router.get("/:id/stream", stream);
//router.put("/:id", update);
//router.delete("/:id", destroy);

router.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export { router };
