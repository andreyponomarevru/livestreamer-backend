#!/bin/bash

echo "Initializing database..."
echo "Creating first app user and assigning him role ('superadmin'), settings, resource permissions (grant all permissions)"

psql \
  -U chillouttribe \
  -d chillouttribe \
  -c "
    INSERT INTO 
      appuser (role_id, username, password_hash, email, is_confirmed, is_deleted) 
    VALUES (1, '$SUPERADMIN_USERNAME', '$SUPERADMIN_PASSWORD', '$SUPERADMIN_EMAIL', true, false);


    INSERT INTO 
      appuser_setting (appuser_id, setting_id, allowed_setting_value_id, unconstrained_value)
    VALUES 
      (1, 1, 1, NULL); 


    INSERT INTO 
      role_resource_permission (role_id, resource_id, permission_id)
    VALUES 
      (1, 1, 1), (1, 1, 2), (1, 1, 3), (1, 1, 4),
      (1, 2, 1), (1, 2, 2), (1, 2, 3), (1, 2, 4),
      (1, 3, 1), (1, 3, 2), (1, 3, 3), (1, 3, 4),
      (1, 4, 1), (1, 4, 2), (1, 4, 3), (1, 4, 4),
      (1, 5, 1), (1, 5, 2), (1, 5, 3), (1, 5, 4),
      (1, 6, 1), (1, 6, 2), (1, 6, 3), (1, 6, 4);
  "
