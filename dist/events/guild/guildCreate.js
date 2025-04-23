"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../prisma");
const logger_1 = require("../../utils/logger");
exports.default = {
    name: 'guildCreate',
    once: false,
    async execute(guild, client) {
        try {
            const discordId = guild.id;
            const serverName = guild.name;
            const existing = await prisma_1.prisma.user.findUnique({ where: { discordId } });
            if (!existing) {
                await prisma_1.prisma.user.create({ data: { discordId, serverName } });
                logger_1.logger.info(`🆕 Serveur ajouté : ${serverName} (${discordId})`);
            }
            else {
                logger_1.logger.warn(`⚠️ Serveur déjà en base : ${serverName} (${discordId})`);
            }
        }
        catch (error) {
            logger_1.logger.error(`❌ Erreur dans guildCreate`, error);
        }
    }
};
