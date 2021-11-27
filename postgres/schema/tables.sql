CREATE TABLE IF NOT EXISTS role (
  PRIMARY KEY (role_id),
  role_id              integer                     GENERATED ALWAYS AS IDENTITY,
  name                 varchar(30)                 NOT NULL, 
																									 UNIQUE (name), 
																									 CHECK (name != '')
);

  

CREATE TABLE IF NOT EXISTS resource (
  PRIMARY KEY (resource_id),
  resource_id          integer                     GENERATED ALWAYS AS IDENTITY,
  name                 varchar(30)                 NOT NULL, 
	                                                 UNIQUE (name), 
																									 CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS permission (
  PRIMARY KEY (permission_id),
  permission_id        integer                     GENERATED ALWAYS AS IDENTITY,
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
  created_at          timestamp with time zone     DEFAULT CURRENT_TIMESTAMP,
  last_login_at       timestamp with time zone     NULL,
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
  PRIMARY KEY (appuser_setting_id),
  appuser_setting_id            integer            GENERATED ALWAYS AS IDENTITY,
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
  created_at          timestamp with time zone     DEFAULT CURRENT_TIMESTAMP,
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
																									CHECK (title != ''),
  tracklist           varchar(800)                DEFAULT '',
  start_at            timestamp with time zone    DEFAULT NULL,
  end_at              timestamp with time zone    DEFAULT NULL,
  listener_peak_count integer                     DEFAULT 0,
  download_url        text                        DEFAULT '',
  listen_url          text                        DEFAULT '',
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
  created_at           timestamp with time zone      DEFAULT CURRENT_TIMESTAMP,
  
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
						  										     					        CHECK (title != ''),
  start_at                timestamp with time zone      DEFAULT NULL,
  end_at                  timestamp with time zone      DEFAULT NULL
);