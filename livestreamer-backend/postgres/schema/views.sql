CREATE VIEW view_broadcast AS
SELECT 
	br.broadcast_id,
	br.title,
	br.tracklist,
	br.start_at,
	br.end_at,
	br.listener_peak_count,
	br.download_url,
	br.listen_url,
	br.is_visible,
	SUM( COALESCE(br_li.count, 0) ) AS like_count
FROM broadcast AS br
  FULL OUTER JOIN
    broadcast_like AS br_li
  ON
    br_li.broadcast_id = br.broadcast_id
  GROUP BY
    br.broadcast_id
  ORDER BY
    start_at,
    br.broadcast_id;



CREATE VIEW view_role_permissions AS
SELECT
	ro.role_id,
	re.name AS resource,
	array_agg(pe.name) AS permissions
FROM role AS ro
	INNER JOIN role_resource_permission AS r_r_p
		ON ro.role_id = r_r_p.role_id
	INNER JOIN permission AS pe
		ON pe.permission_id = r_r_p.permission_id
	INNER JOIN resource AS re
		ON re.resource_id = r_r_p.resource_id
GROUP BY
	r_r_p.resource_id,
	ro.name,
	ro.role_id,
	re.name
ORDER BY
	role_id;



CREATE VIEW view_chat_history AS
SELECT
  c_m.appuser_id,
  c_m.chat_message_id,
  c_m.created_at,
  c_m.message,
  -- if the message doesn't have likes, Postgres returns '[null]' after join. 
  -- To fix this and return just an empty array, we use 'array_remove'
  array_remove(array_agg(c_m_l.appuser_id), NULL) AS liked_by_user_id
FROM chat_message_like AS c_m_l
  FULL OUTER JOIN 
    chat_message AS c_m 
  ON
    c_m.chat_message_id = c_m_l.chat_message_id
  GROUP BY 
    c_m_l.chat_message_id,
    c_m.chat_message_id
  ORDER BY
    c_m.created_at,
    c_m.chat_message_id
  ASC;



CREATE VIEW view_chat_message_likes AS
SELECT 
  c_m.chat_message_id,
  array_remove(array_agg(c_m_l.appuser_id), NULL) AS liked_by_user_id
FROM chat_message_like AS c_m_l
  FULL OUTER JOIN 
    chat_message AS c_m
  ON
    c_m.chat_message_id = c_m_l.chat_message_id
GROUP BY
  c_m.chat_message_id;
