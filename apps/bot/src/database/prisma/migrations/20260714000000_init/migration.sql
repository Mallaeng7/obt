-- CreateTable
CREATE TABLE "AppConfig" (
    "id" TEXT NOT NULL DEFAULT 'app',
    "steamKey" TEXT,
    "discordToken" TEXT,
    "discordAppId" TEXT,
    "fcmCreds" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "appPort" INTEGER NOT NULL,
    "steamId" TEXT NOT NULL,
    "playerToken" TEXT NOT NULL,
    "seed" INTEGER,
    "mapSize" INTEGER,
    "mapImageUrl" TEXT,
    "wipeDate" TIMESTAMP(3),
    "discordGuildId" TEXT,
    "alertChannelId" TEXT,
    "trackerChannelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pollingInterval" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "groupName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastToggled" TIMESTAMP(3),
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isAlive" BOOLEAN NOT NULL DEFAULT true,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "deathCount" INTEGER NOT NULL DEFAULT 0,
    "playTime" INTEGER NOT NULL DEFAULT 0,
    "afkTime" INTEGER NOT NULL DEFAULT 0,
    "lastMoved" TIMESTAMP(3),
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeathLocation" (
    "id" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "killerName" TEXT,
    "weapon" TEXT,
    "distance" DOUBLE PRECISION,
    "teamMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeathLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "metadata" JSONB,
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Camera" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendingItem" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costItem" TEXT NOT NULL,
    "costAmount" INTEGER NOT NULL,
    "currencyIsBp" BOOLEAN NOT NULL DEFAULT false,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "shopName" TEXT,
    "serverId" TEXT NOT NULL,
    "discoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchItem" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerPlugin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "trigger" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBuiltin" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerPlugin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TurretPosition" (
    "id" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 1,
    "label" TEXT,
    "serverId" TEXT NOT NULL,

    CONSTRAINT "TurretPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapNote" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "icon" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#FF6B35',
    "createdBy" TEXT,
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MapNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Server_discordGuildId_idx" ON "Server"("discordGuildId");

-- CreateIndex
CREATE INDEX "Device_serverId_idx" ON "Device"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serverId_entityId_key" ON "Device"("serverId", "entityId");

-- CreateIndex
CREATE INDEX "TeamMember_serverId_idx" ON "TeamMember"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_serverId_steamId_key" ON "TeamMember"("serverId", "steamId");

-- CreateIndex
CREATE INDEX "DeathLocation_teamMemberId_idx" ON "DeathLocation"("teamMemberId");

-- CreateIndex
CREATE INDEX "ServerEvent_serverId_type_idx" ON "ServerEvent"("serverId", "type");

-- CreateIndex
CREATE INDEX "ServerEvent_createdAt_idx" ON "ServerEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Camera_serverId_identifier_key" ON "Camera"("serverId", "identifier");

-- CreateIndex
CREATE INDEX "VendingItem_serverId_itemName_idx" ON "VendingItem"("serverId", "itemName");

-- CreateIndex
CREATE INDEX "WatchItem_serverId_isActive_idx" ON "WatchItem"("serverId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ServerPlugin_serverId_name_key" ON "ServerPlugin"("serverId", "name");

-- CreateIndex
CREATE INDEX "TurretPosition_serverId_idx" ON "TurretPosition"("serverId");

-- CreateIndex
CREATE INDEX "MapNote_serverId_idx" ON "MapNote"("serverId");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeathLocation" ADD CONSTRAINT "DeathLocation_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerEvent" ADD CONSTRAINT "ServerEvent_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendingItem" ADD CONSTRAINT "VendingItem_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchItem" ADD CONSTRAINT "WatchItem_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerPlugin" ADD CONSTRAINT "ServerPlugin_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurretPosition" ADD CONSTRAINT "TurretPosition_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapNote" ADD CONSTRAINT "MapNote_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
