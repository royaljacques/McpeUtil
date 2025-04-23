-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "serverName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServerMcConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ServerMcConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerByHour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hours" TEXT NOT NULL,
    "player" INTEGER NOT NULL,
    "serverId" TEXT NOT NULL,
    CONSTRAINT "PlayerByHour_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerMcConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
