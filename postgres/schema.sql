CREATE TABLE IF NOT EXISTS role (
  PRIMARY KEY (role_id),
  role_id              integer                     NOT NULL,
  name                 varchar(30)                 NOT NULL, 
																									 UNIQUE (name), 
																									 CHECK (name != '')
);

  

CREATE TABLE IF NOT EXISTS resource (
  PRIMARY KEY (resource_id),
  resource_id          integer                     NOT NULL,
  name                 varchar(30)                 NOT NULL, 
	                                                 UNIQUE (name), 
																									 CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS permission (
  PRIMARY KEY (permission_id),
  permission_id        integer                     NOT NULL,
  name                 varchar(70)                 NOT NULL, 
	                                                 UNIQUE (name), 
																									 CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS role_resource_permission (
  PRIMARY KEY (role_id, resource_id, permission_id),
  role_id              integer                     NOT NULL,
  resource_id          integer                     NOT NULL,
  permission_id        integer                     NOT NULL,
  
  FOREIGN KEY (role_id) REFERENCES role (role_id)
	  ON UPDATE NO ACTION 
		ON DELETE CASCADE,
	FOREIGN KEY (resource_id) REFERENCES resource (resource_id) 
		ON UPDATE NO ACTION
		ON DELETE RESTRICT,
	FOREIGN KEY (permission_id) REFERENCES permission (permission_id) 
		ON UPDATE NO ACTION
		ON DELETE RESTRICT     
);

CREATE INDEX 
	role_resource_permission__role_idx 
ON 
	role_resource_permission (role_id ASC);

CREATE INDEX 
	role_resource_permission__resource_idx ON role_resource_permission (resource_id ASC);

CREATE INDEX 
	role_resource_permission__permission_idx 
ON 
	role_resource_permission (permission_id ASC);



CREATE TABLE IF NOT EXISTS appuser (
  PRIMARY KEY (appuser_id),
  appuser_id          integer                      GENERATED ALWAYS AS IDENTITY,
  role_id             integer                      NOT NULL,
  username            varchar(15)                  NOT NULL, 
	                                                 UNIQUE (username), 
																									 CHECK (username != ''),
  password_hash       varchar(72)                  NOT NULL,
  email               varchar(320)                 NOT NULL, 
	                                                 UNIQUE (email), 
																									 CHECK (email != ''),
  created_at          timestamp without time zone  DEFAULT CURRENT_TIMESTAMP,
  last_login_at       timestamp without time zone  NULL,
  is_deleted          boolean                      DEFAULT FALSE,
  is_email_confirmed  boolean                      DEFAULT FALSE, 
	email_confirmation_token  varchar(128)           DEFAULT NULL,
	password_reset_token      varchar(128)           DEFAULT NULL,

  FOREIGN KEY (role_id) REFERENCES role (role_id)
	  ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

CREATE INDEX 
	appuser__role_id_idx 
ON 
	appuser (role_id ASC);



CREATE TABLE IF NOT EXISTS setting (
  PRIMARY KEY (setting_id),
  setting_id           integer                     GENERATED ALWAYS AS IDENTITY,
  name                 varchar(60)                 NOT NULL, 
	                                                 UNIQUE (name), 
																									 CHECK (name != ''),
  is_constrained       boolean                     NOT NULL,
  data_type            varchar(15)                 NOT NULL,
  min_value            varchar(10)                 DEFAULT NULL,
  max_value            varchar(10)                 DEFAULT NULL
);



CREATE TABLE IF NOT EXISTS allowed_setting_value (
  PRIMARY KEY (allowed_setting_value_id),
  allowed_setting_value_id      integer            GENERATED ALWAYS AS IDENTITY,
  setting_id                    integer            NOT NULL,
  value                         varchar(15)        NOT NULL,
  
  FOREIGN KEY (setting_id) REFERENCES setting (setting_id)
	  ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

CREATE INDEX 
	allowed_setting_value__setting_id_idx 
ON 
	allowed_setting_value (setting_id ASC);



CREATE TABLE IF NOT EXISTS appuser_setting (
  -- NOTE: `user setting_id` is used as PK because there may be settings allowing multiple values
  PRIMARY KEY (user_setting_id),
  user_setting_id               integer            GENERATED ALWAYS AS IDENTITY,
  appuser_id                    integer            NOT NULL,
  setting_id                    integer            NOT NULL, 
  allowed_setting_value_id      integer            DEFAULT NULL,
  unconstrained_value           varchar(15)        DEFAULT NULL, 
																									 CHECK (unconstrained_value != ''),
  
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
	  ON UPDATE NO ACTION
    ON DELETE CASCADE,
  FOREIGN KEY (setting_id) REFERENCES setting (setting_id)
    ON UPDATE NO ACTION  
		ON DELETE CASCADE,
  FOREIGN KEY (allowed_setting_value_id) REFERENCES allowed_setting_value (allowed_setting_value_id)
    ON UPDATE NO ACTION  
		ON DELETE RESTRICT 
);

CREATE INDEX 
	appuser_setting__appuser_id_idx 
ON 
	appuser_setting (appuser_id ASC);

CREATE INDEX 
	appuser_setting__setting_id_idx 
ON
	appuser_setting (setting_id ASC);

CREATE INDEX 
	appuser_setting__allowed_setting_value_id_idx 
ON 
	appuser_setting (allowed_setting_value_id ASC);



CREATE TABLE IF NOT EXISTS chat_message (
  PRIMARY KEY (chat_message_id),
  chat_message_id     integer                      GENERATED ALWAYS AS IDENTITY,
  appuser_id          integer                      NOT NULL,
  created_at          timestamp without time zone  DEFAULT CURRENT_TIMESTAMP,
  message             varchar(500)                 NOT NULL, 
	                                                 CHECK (message != ''),
  
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
	  ON UPDATE NO ACTION
    ON DELETE CASCADE
);

CREATE INDEX 
	chat_message__appuser_id_idx 
ON 
	chat_message (appuser_id ASC);

CREATE INDEX 
	chat_message__created_at_idx 
ON 
	chat_message (created_at DESC);


CREATE TABLE IF NOT EXISTS chat_message_like (
  PRIMARY KEY (chat_message_id, appuser_id),
  chat_message_id      integer                     NOT NULL, 
  appuser_id           integer                     NOT NULL,
  
  FOREIGN KEY (chat_message_id) REFERENCES chat_message (chat_message_id)
	  ON UPDATE NO ACTION
    ON DELETE CASCADE,
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
	  ON UPDATE NO ACTION
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS broadcast (
  PRIMARY KEY (broadcast_id),
  broadcast_id        integer                     GENERATED ALWAYS AS IDENTITY,
  title               varchar(70)                 NOT NULL, 
	                                                UNIQUE (title), 
																									CHECK (title != ''),
  tracklist           varchar(800)                DEFAULT NULL, 
	                                               CHECK (tracklist != ''),
  start_at            timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  end_at              timestamp without time zone DEFAULT NULL,
  listener_peak_count integer                     DEFAULT 0,
  download_url        text                        DEFAULT NULL, 
	                                                CHECK (download_url != ''),
  listen_url          text                        DEFAULT NULL, 
	                                                CHECK (listen_url != ''),
  is_visible          boolean                     DEFAULT FALSE,
                                                  CHECK (is_visible != NULL)
);



CREATE TABLE IF NOT EXISTS appuser_bookmark (
  PRIMARY KEY (appuser_id, broadcast_id),
  appuser_id           integer                     NOT NULL,
  broadcast_id         integer                     NOT NULL,
  
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
	  ON UPDATE NO ACTION
    ON DELETE CASCADE,
  FOREIGN KEY (broadcast_id) REFERENCES broadcast (broadcast_id)
    ON UPDATE NO ACTION  
		ON DELETE CASCADE
);

  

CREATE TABLE IF NOT EXISTS broadcast_like (
  PRIMARY KEY (broadcast_id, appuser_id),
  broadcast_id         integer                       NOT NULL,
  appuser_id           integer                       NOT NULL,
  count                integer                       DEFAULT 0,
  created_at           timestamp without time zone   DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (broadcast_id) REFERENCES broadcast (broadcast_id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
    ON UPDATE NO ACTION  
		ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS scheduled_broadcast (
  PRIMARY KEY (scheduled_broadcast_id),
  scheduled_broadcast_id  integer                  GENERATED ALWAYS AS IDENTITY,
  title                   varchar(70)                   NOT NULL, 
	                                                      UNIQUE (title),
						  										     					        CHECK (title != ''),
  start_at                timestamp without time zone   DEFAULT NULL,
  end_at                  timestamp without time zone   DEFAULT NULL
);



--


/* TODO: probabl we don't need this view, delete it
CREATE VIEW view_broadcast_like AS
SELECT
  broadcast_id, 
  SUM(count) AS likes_count
FROM
  broadcast_like 
GROUP BY
  broadcast_id;
*/


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
	SUM(br_li.count) AS likes_count
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
  -- if the message doesn't have likes, Postgres returns '[null]' after join. To fix this and return just an empty array, we use 'array_remove'
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
