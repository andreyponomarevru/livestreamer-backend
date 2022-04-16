INSERT INTO setting (
  name, 
  is_constrained, 
  data_type
)
VALUES (
  'send_email_notifications_for_nearest_scheduled_broadcast', 
  true,  
  'boolean'
);



INSERT INTO	allowed_setting_value 
  (setting_id, value)	
VALUES 
  (1, false), 
  (1, true);



