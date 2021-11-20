#!/bin/bash

# We need this file to be a Bash script instead of regular .sql file in order to be able to inject env vars into SQL statements

echo "Initializing database: creating tables, views and seeding the database"

# 1. Create tables
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -f "/schema/tables.sql" \
  -f "/schema/views.sql" \
  -f "/seeds/permissions.sql" \
  -f "/seeds/resources.sql" \
  -f "/seeds/role-broadcaster.sql" \
  -f "/seeds/role-listener.sql" \
  -f "/seeds/role-superadmin.sql"

# 2. Seed db with default data required for the proper functioning of the app (roles, users, permissions, settings, etc.)
psql \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  -c "
WITH ro_id AS (SELECT role_id FROM role WHERE name = 'superadmin')
INSERT INTO appuser (
  role_id, 
  username, 
  password_hash, 
  email, 
  is_email_confirmed, 
  is_deleted
)
VALUES (
  (SELECT role_id FROM ro_id), 
  '$HAL_USERNAME', 
  '$HAL_PASSWORD', 
  '$HAL_EMAIL', 
  true, 
  false
);



WITH ro_id AS (SELECT role_id FROM role WHERE name = 'broadcaster')
INSERT INTO appuser (
  role_id, 
  username, 
  password_hash, 
  email, 
  is_email_confirmed, 
  is_deleted
)
VALUES (
  (SELECT role_id FROM ro_id), 
  '$ANDREYPONOMAREV_USERNAME', 
  '$ANDREYPONOMAREV_PASSWORD', 
  '$ANDREYPONOMAREV_EMAIL', 
  true, 
  false
);



WITH ro_id AS (SELECT role_id FROM role WHERE name = 'listener')
INSERT INTO appuser (
  role_id, 
  username, 
  password_hash, 
  email, 
  is_email_confirmed, 
  is_deleted
)
VALUES (
  (SELECT role_id FROM ro_id), 
  '$JOHNDOE_USERNAME', 
  '$JOHNDOE_PASSWORD', 
  '$JOHNDOE_EMAIL', 
  true, 
  false
);"

psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -f "/seeds/settings.sql" \
  -f "/seeds/chat-messages.sql" \
  -f "/seeds/chat-message-likes.sql" \
  -f "/seeds/broadcasts.sql" \
  -f "/seeds/bookmarks.sql" \
  -f "/seeds/broadcast-likes.sql" \
  -f "/seeds/scheduled-broadcasts.sql"