import { BroadcastDraft } from "../../types";
import { redisConnection } from "../../config/redis";
import { dbConnection } from "../../config/postgres";

export const streamRepo = {
  create: async function (broadcast: BroadcastDraft): Promise<void> {
    const client = await redisConnection.open();
    await client.HSET("live:broadcast", {
      id: `${broadcast.id}`,
      title: `${broadcast.title}`,
      startAt: `${broadcast.startAt}`,
      listenerPeakCount: `${broadcast.listenerPeakCount}`,
    });
  },

  destroy: async function (): Promise<void> {
    const client = await redisConnection.open();
    await client.del("live:broadcast");
  },

  read: async function (): Promise<BroadcastDraft> {
    const client = await redisConnection.open();
    const broadcast = await client.HGETALL("live:broadcast");
    const parsed: BroadcastDraft = {
      id: Number(broadcast.id),
      title: broadcast.title,
      startAt: broadcast.startAt,
      listenerPeakCount: Number(broadcast.listenerPeakCount),
      likeCount: Number(broadcast.likeCount),
    };
    return parsed;
  },

  readBroadcastId: async function (): Promise<number> {
    const client = await redisConnection.open();
    const id = await client.HGET("live:broadcast", "id");
    return Number(id);
  },

  updateListenerPeakCount: async function (count: number): Promise<void> {
    const client = await redisConnection.open();
    await client.HSET("live:broadcast", { listenerPeakCount: `${count}` });
  },

  readListenerPeakCount: async function (): Promise<number> {
    const client = await redisConnection.open();
    return Number(await client.HGET("live:broadcast", "listenerPeakCount"));
  },

  createLike: async function (
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
    const pool = await dbConnection.open();
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
  },
};
