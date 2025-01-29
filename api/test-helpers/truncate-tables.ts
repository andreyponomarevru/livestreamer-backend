import { beforeAll, beforeEach } from "@jest/globals";
import { Pool } from "pg";
import { dbConnection } from "../src/config/postgres";

let pool: Pool;

beforeAll(async () => (pool = await dbConnection.open()));

beforeEach(async () => {
  await pool.query(
    "TRUNCATE process, track_artist, track_genre, artist, genre, track;",
  );
  await pool.query("ALTER SEQUENCE track_track_id_seq RESTART");
  await pool.query("ALTER SEQUENCE artist_artist_id_seq RESTART");
});
