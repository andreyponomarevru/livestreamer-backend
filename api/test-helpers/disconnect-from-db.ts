import { afterAll } from "@jest/globals";
import { dbConnection } from "../src/config/postgres";

afterAll(async () => await dbConnection.close());
