-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerByHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hours" TEXT NOT NULL,
    "player" INTEGER NOT NULL,
    "serverId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerByHour_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerMcConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerByHour" ("hours", "id", "player", "serverId") SELECT "hours", "id", "player", "serverId" FROM "PlayerByHour";
DROP TABLE "PlayerByHour";
ALTER TABLE "new_PlayerByHour" RENAME TO "PlayerByHour";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
