INSERT INTO 
  chat_message (appuser_id, message)
VALUES 
  (2, 'Now for manners use has company'),
  (3, 'so on result parish.'),
  (2, 'Put use set uncommonly announcing and travelling. Allowance sweetness direction to as necessary :)'),
  (1, 'you did therefore perfectly supposing...'),
  (3, 'reserved sir offering bed judgment may and quitting speaking. Is do be improved'),
  (3, 'no doors on hoped'),
  (3, 'but and towards certain');



INSERT INTO 
  chat_message_like (chat_message_id, appuser_id)
VALUES (3, 2), (3, 1), (3, 3), (2, 2), (2, 3);



INSERT INTO 
  broadcast (
    title,
    tracklist, 
    start_at, 
    end_at, 
    listener_peak_count, 
    download_url, 
    listen_url, 
    is_visible
  )
VALUES (
  'Answer misery', 
  'here should be a tracklist',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  8,
  'http://dropbox.com/fdtterhty/mfdfkNSAnfddKJHWEDDS/test-stream.mp3',
  'http://miscloud.com/tertfgdfg/test-stream',
  true
);

INSERT INTO 
  broadcast (
    title, 
    tracklist, 
    start_at, 
    end_at, 
    listener_peak_count, 
    download_url, 
    listen_url, 
    is_visible
  )
VALUES (
  'Offices parties lasting', 
  'Tracks played...',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  6,
  'http://dropbox.com/fgdfgddffg/mfdfkNSAnfddKJHWEDDS/test-stream.mp3',
  'http://miscloud.com/ereerer/test-stream',
  true
);
  
INSERT INTO 
  broadcast (
    title, 
    tracklist, 
    start_at, 
    end_at, 
    listener_peak_count, 
    download_url, 
    listen_url, 
    is_visible
  )
VALUES (
  'Seen you eyes son show', 
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  7,
  NULL,
  NULL,
  false
);

INSERT INTO 
  broadcast (
    title, 
    tracklist, 
    start_at, 
    end_at, 
    listener_peak_count, 
    download_url, 
    listen_url, 
    is_visible
  )
VALUES (
  'On am we', 
  NULL,
  CURRENT_TIMESTAMP,
  NULL,
  12,
  NULL,
  NULL,
  false
);

INSERT INTO 
  broadcast (
    title, 
    tracklist, 
    start_at, 
    end_at, 
    listener_peak_count, 
    download_url, 
    listen_url, 
    is_visible
  )
VALUES (
  'Necessary ye contented', 
  'tracklist here',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  5,
  'http://dropbox.com/ddfddreyer/mfdfkNSAnfddKJHWEDDS/test-stream.mp3',
  'http://miscloud.com/gdfhjyty/test-stream',
  true
);

INSERT INTO 
  broadcast (
    title,  
    tracklist, 
    start_at, 
    end_at, 
    listener_peak_count, 
    download_url, 
    listen_url, 
    is_visible
  )
VALUES (
  'Any delicate', 
  'Another tracklist',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  6,
  'http://dropbox.com/tuytjhjg/mfdfkNSAnfddKJHWEDDS/test-stream.mp3',
  'http://miscloud.com/rereteht/test-stream',
  true
);

INSERT INTO 
  broadcast (
    title, 
    tracklist, 
    start_at, 
    end_at, 
    listener_peak_count, 
    download_url, 
    listen_url, 
    is_visible
  )
VALUES (
  'Improve him', 
  'tracklist tracklist tracklist',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  4,
  NULL,
  NULL,
  false
);



INSERT INTO 
  appuser_bookmark (appuser_id, broadcast_id)
VALUES
  (2, 1), (3, 2), (3, 1), (2, 4), (1, 5), (2, 5), (1, 1);



INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (2, 2, 1), (1, 3, 1), (2, 3, 1), (2, 1, 1)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;

INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (2, 2, 1), (1, 3, 1), (2, 1, 1)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;

INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (3, 3, 1), (2, 3, 1), (1, 3, 1)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;

INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (1, 3, 1), (2, 3, 1), (3, 3, 1)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;

INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (2, 2, 1), (1, 3, 1)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;

INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (1, 2, 1), (2, 3, 1)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;

INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (4, 1, 1), (4, 2, 1), (5, 3, 1), (6, 3, 6)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;

INSERT INTO broadcast_like (broadcast_id, appuser_id, count)
VALUES (4, 1, 1), (4, 2, 1), (5, 3, 1), (6, 3, 6)
ON CONFLICT (broadcast_id, appuser_id)
DO UPDATE SET count = broadcast_like.count + 1;



INSERT INTO 
  scheduled_broadcast (title, start_at, end_at)
VALUES 
  ('Answer him easily are', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Oh no though mother be', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Dashwood horrible', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('On sure fine kept walk', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Little our played lively',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Do theirs others', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);