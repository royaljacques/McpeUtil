/*
  Warnings:

  - The primary key for the `PlayerByHour` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PlayerByHour` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `serverId` on the `PlayerByHour` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `ServerMcConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ServerMcConfig` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `userId` on the `ServerMcConfig` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerByHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hours" TEXT NOT NULL,
    "player" INTEGER NOT NULL,
    "serverId" INTEGER NOT NULL,
    CONSTRAINT "PlayerByHour_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerMcConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerByHour" ("hours", "id", "player", "serverId") SELECT "hours", "id", "player", "serverId" FROM "PlayerByHour";
DROP TABLE "PlayerByHour";
ALTER TABLE "new_PlayerByHour" RENAME TO "PlayerByHour";
CREATE TABLE "new_ServerMcConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ServerMcConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ServerMcConfig" ("id", "ip", "name", "port", "userId") SELECT "id", "ip", "name", "port", "userId" FROM "ServerMcConfig";
DROP TABLE "ServerMcConfig";
ALTER TABLE "new_ServerMcConfig" RENAME TO "ServerMcConfig";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordId" TEXT NOT NULL,
    "serverName" TEXT NOT NULL
);
INSERT INTO "new_User" ("discordId", "id", "serverName") SELECT "discordId", "id", "serverName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
