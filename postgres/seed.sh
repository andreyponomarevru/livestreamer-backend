#!/bin/bash


echo "Seeding database: creating users, roles, permissions, ..."

# Create tables
psql -U "$POSTGRES_USER" -d "$POSTGRES_USER" < "/schema.sql"


psql \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_USER" \
  -c "
		/* Roles */

		INSERT INTO 
			role (role_id, name) 
		VALUES
			($SUPERADMIN_ID, 'superadmin'),
			($BROADCASTER_ID, 'broadcaster'),
			($LISTENER_ID, 'listener' );


		INSERT INTO 
			resource (resource_id, name)
		VALUES
			($USER_OWN_PROFILE_ID, 'user_own_profile'),
			($ALL_USER_PROFILES_ID, 'all_user_profiles'),
			($USER_OWN_ACCOUNT_ID, 'user_own_account'),
			($ALL_USER_ACCOUNTS_ID, 'all_user_accounts'),
			($USER_OWN_SETTINGS_ID, 'user_own_settings'),
			($USER_OWN_BOOKMARKS_ID, 'user_own_bookmarks'),
			($BROADCAST_ID, 'broadcast'),
			($ALL_BROADCASTS_ID, 'all_broadcasts'),
			($BROADCAST_DRAFT_ID, 'broadcast_draft'),
			($ALL_BROADCAST_DRAFTS_ID, 'all_broadcast_drafts'),
      ($SCHEDULED_BROADCAST_ID, 'scheduled_broadcast'),
			($STREAM_LIKE_ID, 'stream_like'),
			($AUDIO_STREAM_ID, 'audio_stream'),
			($USER_OWN_CHAT_MESSAGE_ID, 'user_own_chat_message'),
      ($ANY_CHAT_MESSAGE_ID, 'any_chat_message');



		/* Permissions for roles */

  	INSERT INTO
			permission (permission_id, name)
		VALUES
			($CREATE_ID, 'create'),
			($READ_ID, 'read'),
			($UPDATE_ID, 'update'),
			($DELETE_ID, 'delete'),
			($UPDATE_PARTIALLY_ID, 'update_partially');



		/* Settings */

		INSERT INTO 
			setting 
				(name, is_constrained, data_type)
		VALUES (
			'send_email_notifications_for_nearest_scheduled_broadcast', true,  'boolean');
 
		INSERT INTO
			allowed_setting_value (setting_id, value)
		VALUES
			(1, false), 
			(1, true)
		RETURNING
			allowed_setting_value_id,
			value;



		/* Users */

    INSERT INTO appuser (
			role_id, 
			username, 
			password_hash, 
			email, 
			is_email_confirmed, 
			is_deleted
		) 
    VALUES (
			$SUPERADMIN_ID, 
			'$HAL_USERNAME', 
			'$HAL_PASSWORD', 
			'$HAL_EMAIL', 
			true, 
			false
		);

    INSERT INTO appuser (
			role_id, 
			username, 
			password_hash, 
			email, 
			is_email_confirmed, 
			is_deleted
		) 
    VALUES (
			$BROADCASTER_ID, 
			'$ANDREYPONOMAREV_USERNAME', 
			'$ANDREYPONOMAREV_PASSWORD', 
			'$ANDREYPONOMAREV_EMAIL', 
			true, 
			false
		);

    INSERT INTO appuser (
			role_id, 
			username, 
			password_hash, 
			email, 
			is_email_confirmed, 
			is_deleted
		) 
    VALUES (
			$LISTENER_ID, 
			'$JOHNDOE_USERNAME', 
			'$JOHNDOE_PASSWORD', 
			'$JOHNDOE_EMAIL', 
			true, 
			false
		);

		/* Assign permissions to each user */

		/* user is superadmin */
  	INSERT INTO
	    role_resource_permission (role_id, resource_id, permission_id)
		VALUES
	 	  ($HAL_ID, $USER_OWN_PROFILE_ID, $CREATE_ID),
			($HAL_ID, $USER_OWN_PROFILE_ID, $READ_ID),
			($HAL_ID, $USER_OWN_PROFILE_ID, $UPDATE_ID),
			($HAL_ID, $USER_OWN_PROFILE_ID, $DELETE_ID),
			($HAL_ID, $USER_OWN_PROFILE_ID, $UPDATE_PARTIALLY_ID),
	
	 	  ($HAL_ID, $ALL_USER_PROFILES_ID, $CREATE_ID),
			($HAL_ID, $ALL_USER_PROFILES_ID, $READ_ID),
			($HAL_ID, $ALL_USER_PROFILES_ID, $UPDATE_ID),
			($HAL_ID, $ALL_USER_PROFILES_ID, $DELETE_ID),
			($HAL_ID, $ALL_USER_PROFILES_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $USER_OWN_ACCOUNT_ID, $CREATE_ID),
			($HAL_ID, $USER_OWN_ACCOUNT_ID, $READ_ID),
			($HAL_ID, $USER_OWN_ACCOUNT_ID, $UPDATE_ID),
			($HAL_ID, $USER_OWN_ACCOUNT_ID, $DELETE_ID),
			($HAL_ID, $USER_OWN_ACCOUNT_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $ALL_USER_ACCOUNTS_ID, $CREATE_ID),
			($HAL_ID, $ALL_USER_ACCOUNTS_ID, $READ_ID),
			($HAL_ID, $ALL_USER_ACCOUNTS_ID, $UPDATE_ID),
			($HAL_ID, $ALL_USER_ACCOUNTS_ID, $DELETE_ID),
			($HAL_ID, $ALL_USER_ACCOUNTS_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $USER_OWN_SETTINGS_ID, $CREATE_ID),
			($HAL_ID, $USER_OWN_SETTINGS_ID, $READ_ID),
			($HAL_ID, $USER_OWN_SETTINGS_ID, $UPDATE_ID),
			($HAL_ID, $USER_OWN_SETTINGS_ID, $DELETE_ID),
			($HAL_ID, $USER_OWN_SETTINGS_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $USER_OWN_BOOKMARKS_ID, $CREATE_ID),
			($HAL_ID, $USER_OWN_BOOKMARKS_ID, $READ_ID),
			($HAL_ID, $USER_OWN_BOOKMARKS_ID, $UPDATE_ID),
			($HAL_ID, $USER_OWN_BOOKMARKS_ID, $DELETE_ID),
			($HAL_ID, $USER_OWN_BOOKMARKS_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $BROADCAST_ID, $CREATE_ID),
			($HAL_ID, $BROADCAST_ID, $READ_ID),
			($HAL_ID, $BROADCAST_ID, $UPDATE_ID),
			($HAL_ID, $BROADCAST_ID, $DELETE_ID),
			($HAL_ID, $BROADCAST_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $ALL_BROADCASTS_ID, $CREATE_ID),
			($HAL_ID, $ALL_BROADCASTS_ID, $READ_ID),
			($HAL_ID, $ALL_BROADCASTS_ID, $UPDATE_ID),
			($HAL_ID, $ALL_BROADCASTS_ID, $DELETE_ID),
			($HAL_ID, $ALL_BROADCASTS_ID, $UPDATE_PARTIALLY_ID),
			
	 	  ($HAL_ID, $BROADCAST_DRAFT_ID, $CREATE_ID),
			($HAL_ID, $BROADCAST_DRAFT_ID, $READ_ID),
			($HAL_ID, $BROADCAST_DRAFT_ID, $UPDATE_ID),
			($HAL_ID, $BROADCAST_DRAFT_ID, $DELETE_ID),
			($HAL_ID, $BROADCAST_DRAFT_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $ALL_BROADCAST_DRAFTS_ID, $CREATE_ID),
			($HAL_ID, $ALL_BROADCAST_DRAFTS_ID, $READ_ID),
			($HAL_ID, $ALL_BROADCAST_DRAFTS_ID, $UPDATE_ID),
			($HAL_ID, $ALL_BROADCAST_DRAFTS_ID, $DELETE_ID),
			($HAL_ID, $ALL_BROADCAST_DRAFTS_ID, $UPDATE_PARTIALLY_ID),
			
	 	  ($HAL_ID, $SCHEDULED_BROADCAST_ID, $CREATE_ID),
			($HAL_ID, $SCHEDULED_BROADCAST_ID, $READ_ID),
			($HAL_ID, $SCHEDULED_BROADCAST_ID, $UPDATE_ID),
			($HAL_ID, $SCHEDULED_BROADCAST_ID, $DELETE_ID),
			($HAL_ID, $SCHEDULED_BROADCAST_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $STREAM_LIKE_ID, $CREATE_ID),
			($HAL_ID, $STREAM_LIKE_ID, $READ_ID),
			($HAL_ID, $STREAM_LIKE_ID, $UPDATE_ID),
			($HAL_ID, $STREAM_LIKE_ID, $DELETE_ID),
			($HAL_ID, $STREAM_LIKE_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $AUDIO_STREAM_ID, $CREATE_ID),
			($HAL_ID, $AUDIO_STREAM_ID, $READ_ID),
			($HAL_ID, $AUDIO_STREAM_ID, $UPDATE_ID),
			($HAL_ID, $AUDIO_STREAM_ID, $DELETE_ID),
			($HAL_ID, $AUDIO_STREAM_ID, $UPDATE_PARTIALLY_ID),

	 	  ($HAL_ID, $USER_OWN_CHAT_MESSAGE_ID, $CREATE_ID),
			($HAL_ID, $USER_OWN_CHAT_MESSAGE_ID, $READ_ID),
			($HAL_ID, $USER_OWN_CHAT_MESSAGE_ID, $UPDATE_ID),
			($HAL_ID, $USER_OWN_CHAT_MESSAGE_ID, $DELETE_ID),
			($HAL_ID, $USER_OWN_CHAT_MESSAGE_ID, $UPDATE_PARTIALLY_ID),

			($HAL_ID, $ANY_CHAT_MESSAGE_ID, $DELETE_ID);


		/* user is listener */
  	INSERT INTO
	    role_resource_permission (role_id, resource_id, permission_id)
		VALUES
	 	  ($LISTENER_ID, $USER_OWN_PROFILE_ID, $CREATE_ID),
			($LISTENER_ID, $USER_OWN_PROFILE_ID, $READ_ID),
			($LISTENER_ID, $USER_OWN_PROFILE_ID, $DELETE_ID),
			($LISTENER_ID, $USER_OWN_PROFILE_ID, $UPDATE_PARTIALLY_ID),
			
			($LISTENER_ID, $USER_OWN_SETTINGS_ID, $READ_ID), 
			($LISTENER_ID, $USER_OWN_SETTINGS_ID, $UPDATE_PARTIALLY_ID),
			
			($LISTENER_ID, $USER_OWN_BOOKMARKS_ID, $CREATE_ID),
			($LISTENER_ID, $USER_OWN_BOOKMARKS_ID, $READ_ID),
			($LISTENER_ID, $USER_OWN_BOOKMARKS_ID, $DELETE_ID),

      ($LISTENER_ID, $BROADCAST_ID, $READ_ID),

      ($LISTENER_ID, $ALL_BROADCASTS_ID, $READ_ID),
			
			($LISTENER_ID, $STREAM_LIKE_ID, $CREATE_ID),
			($LISTENER_ID, $STREAM_LIKE_ID, $UPDATE_ID),
			
			($LISTENER_ID, $USER_OWN_CHAT_MESSAGE_ID, $DELETE_ID);


		/* user is broadcaster */
  	INSERT INTO
	    role_resource_permission (role_id, resource_id, permission_id)
		VALUES
			($BROADCASTER_ID, $AUDIO_STREAM_ID, $CREATE_ID);



		/* Assign settings to each user */

    INSERT INTO 
      appuser_setting (
				appuser_id, 
				setting_id, 
				allowed_setting_value_id, 
				unconstrained_value
			)
    VALUES (
			$HAL_ID, 
			1,
			1, 
			NULL
		); 

    INSERT INTO 
      appuser_setting (
				appuser_id, 
				setting_id, 
				allowed_setting_value_id, 
				unconstrained_value
			)
    VALUES (
			$ANDREYPONOMAREV_ID, 
			1,
			1, 
			NULL
		); 

    INSERT INTO 
      appuser_setting (
				appuser_id, 
				setting_id, 
				allowed_setting_value_id, 
				unconstrained_value
			)
    VALUES (
			$JOHNDOE_ID, 
			1,
			1, 
			NULL
		); 
  "


psql -U "$POSTGRES_USER" -d "$POSTGRES_USER" < "/fake-data.sql"