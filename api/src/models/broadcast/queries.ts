import { logger } from "../../config/logger";
import { ScheduledBroadcast } from "../schedule/schedule";
import {
  Broadcast,
  BroadcastUpdate,
  BroadcastDBResponse,
  NewBroadcast,
  NewBroadcastLike,
  SavedBroadcastLike,
} from "../../types";
import { connectDB } from "../../config/postgres";

type CreateBroadcastDBResponse = {
  broadcast_id: number;
  start_at: string;
  listener_peak_count: number;
};

export async function create({
  title,
  downloadUrl,
  listenerPeakCount,
  isVisible = false,
}: NewBroadcast): Promise<{
  id: number;
  title: string;
  startAt: string;
  listenerPeakCount: number;
}> {
  const sql =
    "INSERT INTO \
			broadcast (title, download_url, is_visible) \
		VALUES \
			($1, $2, $3) \
		RETURNING \
			broadcast_id, \
      start_at,\
      listener_peak_count";
  const values = [title, downloadUrl, isVisible];
  const pool = await connectDB();
  const res = await pool.query<CreateBroadcastDBResponse>(sql, values);

  return {
    id: res.rows[0].broadcast_id,
    title: title,
    startAt: res.rows[0].start_at,
    listenerPeakCount: listenerPeakCount,
  };
}

export async function read(broadcastId: number): Promise<Broadcast | null> {
  const sql = "SELECT * FROM view_published_broadcast WHERE broadcast_id = $1";
  const values = [broadcastId];
  const pool = await connectDB();
  const res = await pool.query<BroadcastDBResponse>(sql, values);

  if (res.rowCount > 0) {
    return {
      id: res.rows[0].broadcast_id,
      title: res.rows[0].title,
      startAt: res.rows[0].start_at,
      endAt: res.rows[0].end_at,
      listenerPeakCount: res.rows[0].listener_peak_count,
      downloadUrl: res.rows[0].download_url,
      listenUrl: res.rows[0].listen_url,
      isVisible: res.rows[0].is_visible,
      likesCount: res.rows[0].likes_count,
      tracklist: res.rows[0].tracklist,
    };
  } else {
    return null;
  }
}
/* Looks like I don;t need it, can be deleted
export async function readLatest() {
  const sql =
    "SELECT \
			br.broadcast_id, \
			br.title, \
			br.start_at, \
			br.listener_peak_count, \
		FROM \
			broadcast \
		ORDER BY start_at DESC LIMIT 1";
  const pool = await connectDB();
  const res = await pool.query<{
    broadcast_id: number;
    title: string;
    description: string;
    start_at: string;
    listener_peak_count: number;
  }>(sql);

  return {
    id: res.rows[0].broadcast_id,
    title: res.rows[0].title,
    startAt: res.rows[0].start_at,
    listenerPeakCount: res.rows[0].listener_peak_count,
  };
}*/

export async function readAll({
  isVisible,
}: {
  isVisible: boolean;
}): Promise<Broadcast[]> {
  const sql = "SELECT * FROM view_broadcast WHERE is_visible = $1";
  const values = [isVisible];
  const pool = await connectDB();
  const res = await pool.query<BroadcastDBResponse>(sql, values);

  if (res.rowCount > 0) {
    const broadcasts: Broadcast[] = res.rows.map((row) => {
      return {
        id: row.broadcast_id,
        title: row.title,
        startAt: row.start_at,
        endAt: row.end_at,
        listenerPeakCount: row.listener_peak_count,
        downloadUrl: row.download_url,
        listenUrl: row.listen_url,
        isVisible: row.is_visible,
        likesCount: row.likes_count,
        tracklist: row.tracklist,
      };
    });
    return broadcasts;
  } else {
    return [];
  }
}

export async function update(
  broadcast: BroadcastUpdate,
  { isVisible }: { isVisible: boolean },
): Promise<void> {
  const sql =
    "UPDATE \
			broadcast \
		SET \
			title = COALESCE($1, title), \
			tracklist = COALESCE($2, tracklist), \
			download_url = COALESCE($3, download_url), \
      listen_url = COALESCE($4, listen_url), \
      listener_peak_count = COALESCE($5, listener_peak_count),\
      is_visible = COALESCE($6, is_visible), \
      end_at = COALESCE($7, end_at) \
		WHERE \
      broadcast_id = $8 AND is_visible = $9";
  const values = [
    broadcast.title,
    broadcast.tracklist,
    broadcast.downloadUrl,
    broadcast.listenUrl,
    broadcast.listenerPeakCount,
    broadcast.isVisible,
    broadcast.endAt,
    broadcast.id,
    isVisible,
  ];
  const pool = await connectDB();
  await pool.query(sql, values);
}

export async function destroy(broadcastId: number): Promise<void> {
  const sql = "DELETE FROM broadcast WHERE broadcast_id = $1";
  const values = [broadcastId];
  const pool = await connectDB();
  await pool.query<{ broadcast_id: number }>(sql, values);
}

export async function like(
  like: NewBroadcastLike,
): Promise<SavedBroadcastLike> {
  // If the user already like the broadcast, 'ON CONFLICT' clause allows us just to increment the counter of an existing row
  const insertSql =
    "INSERT INTO \
			broadcast_like (broadcast_id, appuser_id, count)\
		VALUES \
			($1, $2, 1) \
		ON CONFLICT \
			(broadcast_id, appuser_id) \
		DO UPDATE SET \
			count = broadcast_like.count + 1;";
  const insertValues = [like.broadcastId, like.userId];
  const pool = await connectDB();
  await pool.query(insertSql, insertValues);

  const selectSql =
    "SELECT \
			broadcast_id, \
			SUM(count) \
		FROM \
			broadcast_like \
		WHERE \
			broadcast_id = 1\
		GROUP BY\
			broadcast_id;";
  const res = await pool.query<{ broadcast_id: number; count: number }>(
    selectSql,
  );
  return {
    likedByUserId: like.userId,
    broadcastId: res.rows[0].broadcast_id,
    likesCount: res.rows[0].count,
  };
}

export async function bookmark({
  userId,
  broadcastId,
}: {
  userId: number;
  broadcastId: number;
}): Promise<void> {
  const pool = await connectDB();

  const isBroadcastNotExistSql =
    "SELECT \
      * \
    FROM \
      broadcast \
    WHERE \
      broadcast_id = $1 \
    AND \
      is_visible = false \
    OR NOT EXISTS (\
      SELECT \
        * \
      FROM \
        broadcast \
      WHERE \
        broadcast_id = $1\
      )";
  const isBroadcastNotExistValues = [broadcastId];
  const broadcasts = await pool.query(
    isBroadcastNotExistSql,
    isBroadcastNotExistValues,
  );
  const isBroadcastNotExist = broadcasts.rowCount > 0;

  if (isBroadcastNotExist) return;

  const sql =
    "INSERT INTO appuser_bookmark (appuser_id, broadcast_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
  const values = [userId, broadcastId];
  await pool.query(sql, values);
}

export async function readAllBookmarked(userId: number): Promise<Broadcast[]> {
  const sql =
    "SELECT \
      v_b.*\
    FROM\
      appuser_bookmark AS a_b\
    INNER JOIN\
      view_broadcast AS v_b\
    ON\
      v_b.broadcast_id = a_b.broadcast_id\
    WHERE\
      appuser_id = $1\
    AND\
      v_b.is_visible = true";
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<BroadcastDBResponse>(sql, values);

  return res.rows.map((row) => {
    const r: Broadcast = {
      id: row.broadcast_id,
      title: row.title,
      tracklist: row.tracklist,
      startAt: row.start_at,
      endAt: row.end_at,
      listenerPeakCount: row.listener_peak_count,
      likesCount: row.likes_count,
      downloadUrl: row.download_url,
      listenUrl: row.listen_url,
      isVisible: row.is_visible,
    };
    return r;
  });
}

export async function unbookmark({
  userId,
  broadcastId,
}: {
  userId: number;
  broadcastId: number;
}): Promise<void> {
  const sql =
    "DELETE FROM broadcast_like WHERE appuser_id = $1 AND broadcast_id = $2";
  const values = [userId, broadcastId];
  const pool = await connectDB();
  await pool.query(sql, values);
}
