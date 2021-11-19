import { BroadcastDraft } from "../../types";
import * as redis from "../../config/redis";
import * as postgres from "../../config/postgres";

export async function create(broadcast: BroadcastDraft): Promise<void> {
  const client = redis.connectDB();
  await client.hmset(
    "live:broadcast",
    ...Object.entries({
      id: `${broadcast.id}`,
      title: `${broadcast.title}`,
      startAt: `${broadcast.startAt}`,
      listenerPeakCount: `${broadcast.listenerPeakCount}`,
    }),
  );
}

export async function destroy(): Promise<void> {
  const client = redis.connectDB();
  await client.del("live:broadcast");
}

export async function read(): Promise<BroadcastDraft> {
  const client = redis.connectDB();
  const broadcast = await client.hgetall("live:broadcast");
  const parsed: BroadcastDraft = {
    id: Number(broadcast.id),
    title: broadcast.title,
    startAt: broadcast.startAt,
    listenerPeakCount: Number(broadcast.listenerPeakCount),
    likeCount: Number(broadcast.likeCount),
  };
  return parsed;
}

export async function readBroadcastId(): Promise<number> {
  const client = redis.connectDB();
  const id = await client.hget("live:broadcast", "id");
  return Number(id);
}

export async function updateListenerPeakCount(count: number): Promise<void> {
  const client = redis.connectDB();
  await client.hmset("live:broadcast", ["listenerPeakCount", `${count}`]);
}

export async function readListenerPeakCount(): Promise<number> {
  const client = redis.connectDB();
  return Number(await client.hget("live:broadcast", "listenerPeakCount"));
}

export async function createLike(
  userId: number,
  broadcastId: number,
): Promise<{
  broadcastId: number;
  likedByUserId: number;
  likedByUsername: string;
  likeCount: number;
}> {
  // FIX" looks like you retrieve only particular user's likes, but you need to retrieve ALL user likes

  // If the user already has liked the broadcast, 'ON CONFLICT' clause allows us to just increment the counter of an existing row
  const insertSql =
    "WITH like_counter AS (\
      /* Insert like */ \
      INSERT INTO \
        broadcast_like (broadcast_id, appuser_id, count) \
      VALUES \
        ($1, $2, 1) \
      ON CONFLICT \
        (broadcast_id, appuser_id) \
      DO UPDATE SET \
        count = broadcast_like.count + 1\
      RETURNING \
        appuser_id, broadcast_id, count\
      /* Retrieve username */\
    ) SELECT \
        au.appuser_id, au.username, lc.broadcast_id, lc.count \
      FROM \
        appuser AS au \
      INNER JOIN \
        like_counter AS lc \
      ON \
        au.appuser_id = lc.appuser_id";
  const insertValues = [broadcastId, userId];
  const pool = await postgres.connectDB();
  const res = await pool.query<{
    appuser_id: number;
    username: string;
    broadcast_id: number;
    count: number;
  }>(insertSql, insertValues);

  return {
    likedByUserId: res.rows[0].appuser_id,
    likedByUsername: res.rows[0].username,
    broadcastId: res.rows[0].broadcast_id,
    likeCount: res.rows[0].count,
  };
}
