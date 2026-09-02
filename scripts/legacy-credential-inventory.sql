-- Tasvin legacy credential inventory (READ ONLY)
-- Purpose: quantify legacy User.password exposure before any production migration.
-- Safety: this script performs SELECT statements only and never returns password values.

SELECT
  COUNT(*)::bigint AS total_users,
  COUNT(*) FILTER (WHERE "password" IS NOT NULL)::bigint AS users_with_legacy_password,
  COUNT(*) FILTER (WHERE "password" IS NULL)::bigint AS users_without_legacy_password
FROM "User";

SELECT
  COUNT(*) FILTER (WHERE "password" IS NOT NULL AND length("password") > 0)::bigint AS non_empty_legacy_passwords,
  COUNT(*) FILTER (WHERE "password" IS NOT NULL AND length("password") = 0)::bigint AS empty_legacy_passwords
FROM "User";

SELECT
  COUNT(*) FILTER (WHERE "phone" IS NOT NULL)::bigint AS users_with_phone,
  COUNT(*) FILTER (WHERE "phone" IS NULL)::bigint AS users_without_phone
FROM "User";
