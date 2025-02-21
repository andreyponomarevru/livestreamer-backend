import request from "supertest";
import { httpServer } from "../src/http-server";

type Credentials = { username: string; password: string };

export async function signIn({ username, password }: Credentials) {
  const agent = request.agent(httpServer);
  return agent
    .post("/sessions")
    .set("accept", "application/json")
    .send({ username, password });
}
