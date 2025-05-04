-- CreateTable
CREATE TABLE "DiscordConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordId" TEXT NOT NULL,
    "serverName" TEXT NOT NULL,
    "updateChannel" TEXT,
    "updateMessageId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en_US'
);

-- CreateTable
CREATE TABLE "ServerMcConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "ServerMcConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DiscordConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerByHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hours" TEXT NOT NULL,
    "player" INTEGER NOT NULL,
    "serverId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerByHour_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerMcConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordConfig_discordId_key" ON "DiscordConfig"("discordId");
