# Database setup

Run these SQL files against a fresh `mydevify_social` database in order:

1. `mydevify_social.sql` — core tables (users, posts, comments, likes, relationships, stories) + seed data
2. `notifications_table.sql` — notifications
3. `saved_posts_table.sql` — saved posts
4. `messages_table.sql` — direct messages
5. `enhanced_messaging_tables.sql` — messaging extras (read/delivered flags, etc.)
6. `follow_requests_and_typing.sql` — follow requests + typing indicators

Quick start:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mydevify_social;"
mysql -u root -p mydevify_social < db/mydevify_social.sql
mysql -u root -p mydevify_social < db/notifications_table.sql
mysql -u root -p mydevify_social < db/saved_posts_table.sql
mysql -u root -p mydevify_social < db/messages_table.sql
mysql -u root -p mydevify_social < db/enhanced_messaging_tables.sql
mysql -u root -p mydevify_social < db/follow_requests_and_typing.sql
```

Or, for the messaging extras only, `node scripts/setup_database.js` (reads credentials from `API/.env`).
