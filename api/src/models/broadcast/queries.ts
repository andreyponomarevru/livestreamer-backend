import {
  Broadcast,
  BroadcastUpdate,
  BroadcastDBResponse,
  NewBroadcast,
  Bookmark,
  BroadcastDraft,
} from "../../types";
import { dbConnection } from "../../config/postgres";

type CreateBroadcastDBResponse = {
  broadcast_id: number;
  start_at: string;
  listener_peak_count: number;
};

export const broadcastRepo = {
  create: async function ({
    title,
    listenerPeakCount,
    isVisible = false,
    startAt,
  }: NewBroadcast): Promise<BroadcastDraft> {
    const sql =
      "INSERT INTO \
        broadcast (title, is_visible, start_at) \
      VALUES \
        ($1, $2, $3) \
      RETURNING \
        broadcast_id, \
        start_at,\
        listener_peak_count";
    const values = [title, isVisible, startAt];
    const pool = await dbConnection.open();
    const res = await pool.query<CreateBroadcastDBResponse>(sql, values);

    return {
      id: res.rows[0].broadcast_id,
      title: title,
      startAt: res.rows[0].start_at,
      listenerPeakCount: listenerPeakCount,
      likeCount: 0,
    };
  },

  read: async function (broadcastId: number): Promise<Broadcast | null> {
    const sql =
      "SELECT * FROM view_published_broadcast WHERE broadcast_id = $1";
    const values = [broadcastId];
    const pool = await dbConnection.open();
    const res = await pool.query<BroadcastDBResponse>(sql, values);

    if (res.rowCount !== null && res.rowCount > 0) {
      return {
        id: res.rows[0].broadcast_id,
        title: res.rows[0].title,
        startAt: res.rows[0].start_at,
        endAt: res.rows[0].end_at,
        listenerPeakCount: res.rows[0].listener_peak_count,
        downloadUrl: res.rows[0].download_url,
        listenUrl: res.rows[0].listen_url,
        isVisible: res.rows[0].is_visible,
        likeCount: res.rows[0].like_count,
        tracklist: res.rows[0].tracklist,
      };
    } else {
      return null;
    }
  },

  readAll: async function ({
    isVisible,
  }: {
    isVisible: boolean;
  }): Promise<Broadcast[]> {
    const sql =
      "SELECT * FROM view_broadcast WHERE is_visible = $1 ORDER BY start_at DESC";
    const values = [isVisible];
    const pool = await dbConnection.open();
    const res = await pool.query<BroadcastDBResponse>(sql, values);

    if (res.rowCount !== null && res.rowCount > 0) {
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
          likeCount: row.like_count,
          tracklist: row.tracklist,
        };
      });
      return broadcasts;
    } else {
      return [];
    }
  },

  update: async function (
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
    const pool = await dbConnection.open();
    await pool.query(sql, values);
  },

  destroy: async function (broadcastId: number): Promise<void> {
    const sql = "DELETE FROM broadcast WHERE broadcast_id = $1";
    const values = [broadcastId];
    const pool = await dbConnection.open();
    await pool.query<{ broadcast_id: number }>(sql, values);
  },

  readLikesCount: async function (
    broadcastId: number,
  ): Promise<{ likeCount: number }> {
    const pool = await dbConnection.open();
    const selectSql =
      "SELECT like_count FROM view_broadcast WHERE broadcast_id = $1";
    const selectValues = [broadcastId];
    const res = await pool.query<{ like_count: number }>(
      selectSql,
      selectValues,
    );
    return { likeCount: res.rows[0].like_count };
  },

  bookmark: async function (bookmark: Bookmark): Promise<void> {
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
    const isBroadcastNotExistValues = [bookmark.broadcastId];
    const pool = await dbConnection.open();
    const broadcasts = await pool.query(
      isBroadcastNotExistSql,
      isBroadcastNotExistValues,
    );
    const isBroadcastNotExist =
      broadcasts.rowCount !== null && broadcasts.rowCount > 0;

    if (!isBroadcastNotExist) {
      const sql =
        "INSERT INTO appuser_bookmark (appuser_id, broadcast_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
      const values = [bookmark.userId, bookmark.broadcastId];
      await pool.query(sql, values);
    }
  },

  readAllBookmarked: async function (userId: number): Promise<Broadcast[]> {
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
    const pool = await dbConnection.open();
    const res = await pool.query<BroadcastDBResponse>(sql, values);

    return res.rows.map((row) => {
      const r: Broadcast = {
        id: row.broadcast_id,
        title: row.title,
        tracklist: row.tracklist,
        startAt: row.start_at,
        endAt: row.end_at,
        listenerPeakCount: row.listener_peak_count,
        likeCount: row.like_count,
        downloadUrl: row.download_url,
        listenUrl: row.listen_url,
        isVisible: row.is_visible,
      };
      return r;
    });
  },

  unbookmark: async function (bookmark: Bookmark): Promise<void> {
    const sql =
      "DELETE FROM appuser_bookmark WHERE appuser_id = $1 AND broadcast_id = $2";
    const values = [bookmark.userId, bookmark.broadcastId];
    const pool = await dbConnection.open();
    await pool.query(sql, values);
  },
};
