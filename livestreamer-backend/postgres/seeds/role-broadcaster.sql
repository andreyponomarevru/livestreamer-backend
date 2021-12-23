INSERT INTO role 
  (name) 
VALUES
  ('broadcaster');


--
-- Role permissions
--

-- 'audio_stream'

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
    role.name = 'broadcaster' AND
    resource.name = 'audio_stream' AND
    permission.name = 'create'
)
INSERT INTO role_resource_permission 
  (role_id, resource_id, permission_id)
SELECT role_id, resource_id, permission_id FROM rrp_ids;