import { Guild, Client, EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '../../prisma';
import { logger } from '../../utils/logger';
import ErrorHandler from '../../handlers/errorHandler'; 
import { config } from '../../config';
import confchannel from '../../config/channels.json'; // Import du fichier channels.json
export default {
  name: 'guildCreate',
  once: false,
  async execute(guild: Guild, client: Client) {
    const errorHandler = new ErrorHandler(client); 

    try {
      const discordId = guild.id;
      const serverName = guild.name;
      const memberCount = guild.memberCount; 
      const existing = await prisma.discordConfig.findUnique({ where: { discordId } });

      if (!existing) {
        await prisma.discordConfig.create({
          data: {
            discordId,
            serverName,
            language: 'en_US'
          }
        });
        logger.info(`🆕 Serveur ajouté : ${serverName} (${discordId})`);
      } else {
        logger.warn(`⚠️ Serveur déjà en base : ${serverName} (${discordId})`);
      }

      const notificationChannelId = confchannel.channels.server_join_logging; // Remplacez par l'ID du salon où envoyer le message
      const notificationChannel = client.channels.cache.get(notificationChannelId) as TextChannel;

      if (!notificationChannel || !notificationChannel.isTextBased()) {
        await errorHandler.handleError({
          type: "error",
          message: `Le salon de notification avec l'ID ${notificationChannelId} est introuvable ou invalide.`
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("📥 Nouveau serveur ajouté")
        .setDescription(`${serverName} vient de m'inviter. Il a actuellement **${memberCount} membres**.`)
        .setColor("Green")
        .setTimestamp();

      await notificationChannel.send({ embeds: [embed] });
    } catch (error) {
      await errorHandler.handleError({
        type: "error",
        message: "Erreur dans guildCreate"
      });
    }
  }
};