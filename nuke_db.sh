#!/bin/bash

source .SECRETS

psql -d wagerwars_db << EOF
DROP TABLE auth_group CASCADE;
DROP TABLE auth_group_permissions CASCADE;
DROP TABLE auth_permission CASCADE;
DROP TABLE auth_user CASCADE;
DROP TABLE auth_user_groups CASCADE;
DROP TABLE auth_user_user_permissions CASCADE;
DROP TABLE core_player CASCADE;
DROP TABLE core_bet CASCADE;
DROP TABLE core_game CASCADE;
DROP TABLE core_round CASCADE;
DROP TABLE core_team CASCADE;
DROP TABLE django_admin_log CASCADE;
DROP TABLE django_content_type CASCADE;
DROP TABLE django_migrations CASCADE;
DROP TABLE django_session CASCADE;
EOF

rm -rf ./core/migrations/
mkdir -p ./core/migrations
touch ./core/migrations/__init__.py
