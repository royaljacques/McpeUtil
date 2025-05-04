-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscordConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordId" TEXT NOT NULL,
    "serverName" TEXT NOT NULL,
    "updateChannel" TEXT,
    "updateMessageId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en_US'
);
INSERT INTO "new_DiscordConfig" ("discordId", "id", "serverName", "updateChannel", "updateMessageId") SELECT "discordId", "id", "serverName", "updateChannel", "updateMessageId" FROM "DiscordConfig";
DROP TABLE "DiscordConfig";
ALTER TABLE "new_DiscordConfig" RENAME TO "DiscordConfig";
CREATE UNIQUE INDEX "DiscordConfig_discordId_key" ON "DiscordConfig"("discordId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
