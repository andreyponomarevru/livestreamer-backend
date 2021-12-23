#!/bin/bash

# We need this file to be a Bash script instead of regular .sql file in order to be able to inject env vars into SQL statements

echo "Initializing database "$POSTGRES_DB" for user "$POSTGRES_USER": creating tables, views and seeding the database"

# 1. Create and seed tables with the most basic data
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -f "/sql/schema/tables.sql" \
  -f "/sql/schema/views.sql" \
  -f "/sql/seeds/permissions.sql" \
  -f "/sql/seeds/resources.sql" \
  -f "/sql/seeds/role-broadcaster.sql" \
  -f "/sql/seeds/role-listener.sql" \
  -f "/sql/seeds/role-superadmin.sql"

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
  -f "/sql/seeds/settings.sql" \
  -f "/sql/seeds/chat-messages.sql" \
  -f "/sql/seeds/chat-message-likes.sql" \
  -f "/sql/seeds/broadcasts.sql" \
  -f "/sql/seeds/bookmarks.sql" \
  -f "/sql/seeds/broadcast-likes.sql" \
  -f "/sql/seeds/scheduled-broadcasts.sql"
