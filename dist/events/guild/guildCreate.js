import { prisma } from '../../prisma';
import { logger } from '../../utils/logger';
export default {
    name: 'guildCreate',
    once: false,
    async execute(guild, client) {
        try {
            const discordId = guild.id;
            const serverName = guild.name;
            const existing = await prisma.user.findUnique({ where: { discordId } });
            if (!existing) {
                await prisma.user.create({ data: { discordId, serverName } });
                logger.info(`🆕 Serveur ajouté : ${serverName} (${discordId})`);
            }
            else {
                logger.warn(`⚠️ Serveur déjà en base : ${serverName} (${discordId})`);
            }
        }
        catch (error) {
            logger.error(`❌ Erreur dans guildCreate`, error);
        }
    }
};
