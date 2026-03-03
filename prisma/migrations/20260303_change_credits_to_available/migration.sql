-- AlterTable: Rename creditsUsed to creditsAvailable and creditsReset to creditsResetAt
ALTER TABLE "User" RENAME COLUMN "creditsUsed" TO "creditsAvailable";
ALTER TABLE "User" RENAME COLUMN "creditsReset" TO "creditsResetAt";

-- Update existing users: convert creditsUsed to creditsAvailable
-- FREE users: creditsAvailable = 3 - creditsUsed
-- PREMIUM users: creditsAvailable = 9999
UPDATE "User"
SET "creditsAvailable" = CASE
  WHEN "plan" = 'PREMIUM' THEN 9999
  ELSE GREATEST(0, 3 - "creditsAvailable")
END;
