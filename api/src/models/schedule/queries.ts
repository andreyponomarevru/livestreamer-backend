import { connectDB } from "../../config/postgres";
import { ScheduledBroadcastDBResponse, Schedule } from "../../types";

type NewScheduledBroadcast = {
  title: string;
  startAt: string;
  endAt: string;
};
type SavedScheduledBroadcast = {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
};

export async function create({
  title,
  startAt,
  endAt,
}: NewScheduledBroadcast): Promise<SavedScheduledBroadcast> {
  const sql =
    "INSERT INTO\
			scheduled_broadcast (title, start_at, end_at)\
		VALUES \
      ($1, $2, $3)\
    RETURNING \
      scheduled_broadcast_id";
  const values = [title, startAt, endAt];
  const pool = await connectDB();
  const scheduledBroadcast = await pool.query<{
    scheduled_broadcast_id: number;
  }>(sql, values);

  return {
    id: scheduledBroadcast.rows[0].scheduled_broadcast_id,
    title,
    startAt,
    endAt,
  };
}

export async function destroy(broadcastId: number): Promise<void> {
  const sql =
    "DELETE FROM scheduled_broadcast WHERE scheduled_broadcast_id=$1 RETURNING scheduled_broadcast_id";
  const values = [broadcastId];
  const pool = await connectDB();
  await pool.query<{ scheduled_broadcast_id: number }>(sql, values);
}

export async function readAll(): Promise<Schedule[]> {
  const sql = "SELECT * FROM scheduled_broadcast";
  const pool = await connectDB();
  const res = await pool.query<ScheduledBroadcastDBResponse>(sql);

  const broadcasts = res.rows.map((row) => {
    return {
      id: row.scheduled_broadcast_id,
      title: row.title,
      startAt: row.start_at.toISOString(),
      endAt: row.end_at.toISOString(),
    };
  });

  return broadcasts;
}
