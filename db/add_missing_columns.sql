-- Columns referenced by the API that were missing from the base schema.
-- Run once. (MySQL 8 does not support ADD COLUMN IF NOT EXISTS, so only run
-- this on a database that doesn't already have these columns.)

-- Verified badge + online presence, used by relationship and messaging queries.
ALTER TABLE users
  ADD COLUMN verified TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN status ENUM('online', 'offline', 'away') NOT NULL DEFAULT 'offline',
  ADD COLUMN lastSeen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
