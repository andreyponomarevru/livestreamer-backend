import { jest, describe, it, expect, beforeAll } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { scheduleRepo } from "../../../src/models/schedule/queries";
import { dbConnection } from "../../../src/config/postgres";
import { ScheduledBroadcastDBResponse } from "../../../src/types";
import { Pool } from "pg";

jest.mock("../../../src/config/logger");

let pool: Pool;

// now + 1sec
const futureTimestamp1 = new Date().getTime() + 1000;
// (now + 1sec) + 1hr
const futureTimestamp2 = futureTimestamp1 + 1 * 60 * 60 * 1000;
const broadcast = {
  title: faker.string.alpha(),
  startAt: new Date(futureTimestamp1).toISOString(),
  endAt: new Date(futureTimestamp2).toISOString(),
};

beforeAll(async () => (pool = await dbConnection.open()));

describe("scheduleRepo", () => {
  describe("create", () => {
    it("inserts a new scheduled broadcast in db", async () => {
      await scheduleRepo.create(broadcast);

      const res = await pool.query<ScheduledBroadcastDBResponse>(
        "SELECT * FROM scheduled_broadcast",
      );
      expect(res.rowCount).toBe(1);
      expect(res.rows[0]).toStrictEqual({
        scheduled_broadcast_id: expect.any(Number),
        title: broadcast.title,
        start_at: new Date(broadcast.startAt),
        end_at: new Date(broadcast.endAt),
      });
    });

    it("returns a new scheduled broadcast", async () => {
      const scheduledBroadcast = await scheduleRepo.create(broadcast);

      expect(scheduledBroadcast).toStrictEqual({
        id: expect.any(Number),
        title: broadcast.title,
        startAt: broadcast.startAt,
        endAt: broadcast.endAt,
      });
    });
  });

  describe("destroy", () => {
    it("deletes scheduled broadcast", async () => {
      const initialScheduledBroadcasts = await pool.query(
        "SELECT scheduled_broadcast_id FROM scheduled_broadcast",
      );
      expect(initialScheduledBroadcasts.rowCount).toBe(0);

      const scheduledBroadcast = await scheduleRepo.create(broadcast);

      await scheduleRepo.destroy(scheduledBroadcast.id);

      const res = await pool.query(
        "SELECT scheduled_broadcast_id FROM scheduled_broadcast",
      );
      expect(res.rowCount).toBe(0);
    });
  });

  describe("readAll", () => {
    it("returns all scheduled broadcasts", async () => {
      for (let i = 0; i < 3; i++) await scheduleRepo.create(broadcast);

      const scheduledBroadcasts = await scheduleRepo.readAll();

      expect(scheduledBroadcasts.length).toBe(3);
    });

    it("returns broadcasts with appropriate values", async () => {
      for (let i = 0; i < 3; i++) await scheduleRepo.create(broadcast);

      const scheduledBroadcasts = await scheduleRepo.readAll();

      expect(scheduledBroadcasts[0]).toStrictEqual({
        id: expect.any(Number),
        title: broadcast.title,
        startAt: broadcast.startAt,
        endAt: broadcast.endAt,
      });
    });
  });
});
