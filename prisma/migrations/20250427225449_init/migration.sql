/*
  Warnings:

  - You are about to drop the column `updateMessageId` on the `ServerMcConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiscordConfig" ADD COLUMN "updateMessageId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServerMcConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "ServerMcConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DiscordConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ServerMcConfig" ("id", "ip", "name", "port", "type", "userId") SELECT "id", "ip", "name", "port", "type", "userId" FROM "ServerMcConfig";
DROP TABLE "ServerMcConfig";
ALTER TABLE "new_ServerMcConfig" RENAME TO "ServerMcConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
