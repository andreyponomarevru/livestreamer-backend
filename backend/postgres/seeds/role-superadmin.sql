INSERT INTO role 
  (name) 
VALUES 
  ('superadmin');



--
-- App Settings
--
/*
TODO: currently, dublicates are allowed, fix this
TODO: refactor the query to get rid of hardcoded setting values (like below where I pass setting IDs).

WITH ap_id AS (
  SELECT appuser_id FROM appuser WHERE username = 'hal'
)
INSERT INTO appuser_setting (
    appuser_id, 
    setting_id, 
    allowed_setting_value_id, 
    unconstrained_value
  )
VALUES (
  (SELECT appuser_id FROM ap_id), 
  1,
  1, 
  NULL
); 
*/
 


--
-- Role permissions
--

-- "user_own_chat_message"

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'user_own_chat_message' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "audio_stream" 

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'audio_stream' AND
    permission.name = 'create'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "broadcast_draft"

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'broadcast_draft' AND
    permission.name = 'read'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'broadcast_draft' AND
    permission.name = 'create'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'broadcast_draft' AND
    permission.name = 'update_partially'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'broadcast_draft' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "user_own_bookmarks" 

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'user_own_bookmarks' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'user_own_bookmarks' AND
    permission.name = 'create'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'user_own_bookmarks' AND
    permission.name = 'read'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "broadcast" 

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'broadcast' AND
    permission.name = 'update_partially'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'broadcast' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "scheduled_broadcast" 

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'scheduled_broadcast' AND
    permission.name = 'create'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'scheduled_broadcast' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "user_own_account" 

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'user_own_account' AND
    permission.name = 'partially_update'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "any_chat_message"

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'any_chat_message' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- "all_user_accounts" 

WITH rrp_ids AS (
  SELECT 
    role.role_id,
    resource.resource_id,
    permission.permission_id
  FROM 
    role,
    resource,
    permission
  WHERE 
    role.name = 'superadmin' AND
    resource.name = 'all_user_accounts' AND
    permission.name = 'read'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;