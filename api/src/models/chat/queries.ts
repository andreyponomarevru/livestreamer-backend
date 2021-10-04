import { connectDB } from "../../config/postgres";
import {
  CursorPagination,
  ChatMsg,
  ChatMsgId,
  ChatMsgLike,
  ChatMsgUnlike,
  NewChatMsg,
  PaginatedChatMsgs,
} from "../../types";
import { decodeCursor, encodeCursor } from "../../utils/utils";

type ReadMsgDBResponse = {
  chat_message_id: number;
  appuser_id: number;
  username: string;
  message: string;
  created_at: string;
  liked_by_user_id: number[];
};

type CreateMsgLikeDBResponse = {
  chat_message_id: number;
  liked_by_user_id: number[];
};

export async function createMsg(msg: NewChatMsg): Promise<ChatMsg> {
  const insertSql =
    "INSERT INTO chat_message (appuser_id, message) VALUES ($1, $2) RETURNING chat_message_id";
  const insertValues = [msg.userId, msg.message];
  const pool = await connectDB();
  const insertedMsgId = await pool.query<{ chat_message_id: number }>(
    insertSql,
    insertValues,
  );

  const selectSql =
    "SELECT \
      au.username,\
      v_c_h.* \
    FROM \
      view_chat_history AS v_c_h\
    INNER JOIN \
      appuser AS au \
    ON \
      au.appuser_id = v_c_h.appuser_id \
    WHERE \
      v_c_h.chat_message_id = $1";
  const newMsg = await pool.query<ReadMsgDBResponse>(selectSql, [
    insertedMsgId.rows[0].chat_message_id,
  ]);

  return {
    id: newMsg.rows[0].chat_message_id,
    userId: newMsg.rows[0].appuser_id,
    username: newMsg.rows[0].username,
    message: newMsg.rows[0].message,
    createdAt: newMsg.rows[0].created_at,
    likedByUserId: newMsg.rows[0].liked_by_user_id,
  };
}

export async function destroyMsg(msg: ChatMsgId): Promise<ChatMsgId | void> {
  const sql =
    "DELETE FROM \
			chat_message \
		WHERE \
      appuser_id = $1 \
    AND \
      chat_message_id = $2\
    RETURNING \
      chat_message_id";
  const values = [msg.userId, msg.id];
  const pool = await connectDB();
  const res = await pool.query<{ chat_message_id: number }>(sql, values);

  // If user tries to delete nonexistent message, don't return anything
  if (res.rows[0].chat_message_id) {
    return { userId: msg.userId, id: msg.id };
  }
}

export async function readMsgsPaginated(
  page: CursorPagination,
): Promise<PaginatedChatMsgs> {
  const sql =
    "SELECT \
        username, v_c_h.*\
      FROM \
        appuser AS usr \
      INNER JOIN \
        view_chat_history AS v_c_h\
      ON \
        usr.appuser_id = v_c_h.appuser_id \
      WHERE\
        /* if user doesn't provide nextCursor, just return the last N rows */\
        ($1::timestamp IS NULL OR $2::integer IS NULL)\
          OR\
        /* if user provides nextCursor, return msgs starting from this cursor*/\
        ($1::timestamp IS NOT NULL AND \
         $2::integer IS NOT NULL AND \
         v_c_h.created_at <= $1 AND \
         chat_message_id <= $2)\
      ORDER BY \
        v_c_h.created_at DESC, \
        chat_message_id DESC\
      LIMIT $3 + 1";

  const [cursor1, cursor2] = decodeCursor(page.nextCursor);
  const values = [cursor1, cursor2, page.limit];
  const pool = await connectDB();
  const res = await pool.query<ReadMsgDBResponse>(sql, values);

  // If there IS a new next page, set next cursor. Otherwise next_cursor remains "null" (in other words, if db response (retrieving limit+1) contains more rows than 'limit' query, set next cursor).

  let msgs: ChatMsg[] = res.rows.map((row) => {
    return {
      id: row.chat_message_id,
      createdAt: row.created_at,
      likedByUserId: row.liked_by_user_id,
      userId: row.appuser_id,
      username: row.username,
      message: row.message,
    };
  });

  if (msgs.length <= page.limit) {
    return { nextCursor: null, messages: msgs };
  } else {
    // To handle cases when multiple messages have the same timestamp, we create composite cursor combining record's timestampt and id
    const lastRowCursor = [
      res.rows[res.rows.length - 1].created_at,
      res.rows[res.rows.length - 1].chat_message_id,
    ].join(",");
    const newNextCursor = encodeCursor(lastRowCursor);
    msgs = msgs.splice(0, msgs.length - 1);

    return { nextCursor: newNextCursor, messages: msgs };
  }
}

export async function createMsgLike(msg: ChatMsgId): Promise<ChatMsgLike> {
  const insertSql =
    "INSERT INTO \
      chat_message_like (appuser_id, chat_message_id) \
    VALUES \
      ($1, $2) \
    ON CONFLICT \
      DO NOTHING";
  const insertValues = [msg.userId, msg.id];
  const pool = await connectDB();
  await pool.query(insertSql, insertValues);

  const selectSql =
    "SELECT * FROM view_chat_message_likes WHERE chat_message_id = $1";
  const selectValues = [msg.id];
  const res = await pool.query<CreateMsgLikeDBResponse>(
    selectSql,
    selectValues,
  );

  return {
    messageId: msg.id,
    likedByUserId: msg.userId,
    likedByUserIds: res.rows[0].liked_by_user_id,
  };
}

export async function destroyMsgLike(
  msg: ChatMsgId,
): Promise<ChatMsgUnlike | void> {
  const deleteSql =
    "DELETE FROM \
      chat_message_like \
    WHERE \
      appuser_id = $1 \
    AND \
      chat_message_id = $2";
  const deleteValues = [msg.userId, msg.id];
  const pool = await connectDB();
  await pool.query(deleteSql, deleteValues);

  const selectSql =
    "SELECT * FROM view_chat_message_likes WHERE chat_message_id = $1";
  const selectValues = [msg.id];
  const res = await pool.query<CreateMsgLikeDBResponse>(
    selectSql,
    selectValues,
  );

  // If user tries to delete the like of nonexistent message, don't return anything
  if (res.rows[0].liked_by_user_id) {
    return {
      messageId: msg.id,
      unlikedByUserId: msg.userId,
      likedByUserIds: res.rows[0].liked_by_user_id,
    };
  }
}
