INSERT INTO role 
  (name) 
VALUES 
  ('listener');


--
-- Role permissions
--

-- 'user_own_account'

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
    role.name = 'listener' AND
    resource.name = 'user_own_account' AND
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
    role.name = 'listener' AND
    resource.name = 'user_own_account' AND
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
    role.name = 'listener' AND
    resource.name = 'user_own_account' AND
    permission.name = 'update'
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
    role.name = 'listener' AND
    resource.name = 'user_own_account' AND
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
    role.name = 'listener' AND
    resource.name = 'user_own_account' AND
    permission.name = 'update_partially'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- 'user_own_bookmarks'

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
    role.name = 'listener' AND
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
    role.name = 'listener' AND
    resource.name = 'user_own_bookmarks' AND
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
    role.name = 'listener' AND
    resource.name = 'user_own_bookmarks' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



-- 'broadcast'

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
    role.name = 'listener' AND
    resource.name = 'broadcast' AND
    permission.name = 'read'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;



--- 'user_own_chat_message'

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
    role.name = 'listener' AND
    resource.name = 'user_own_chat_message' AND
    permission.name = 'delete'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;