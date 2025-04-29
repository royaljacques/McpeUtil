import { Client, Events, EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '../../prisma';
import { logger } from '../../utils/logger';
import { HourlyChecker } from '../../utils/date';
import getServerInfo from '../../utils/serverPing';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log("✅ Client prêt :", client.user?.tag);
    logger.info(`✅ Connecté en tant que ${client.user?.tag}`);

    setInterval(async () => {
      try {
        const configs = await prisma.discordConfig.findMany({
          include: { serverMcConfig: true }
        });

        const fields: any[] = [];

        for (const config of configs) {
          if (!config.updateChannel) continue;

          const channel = await client.channels.fetch(config.updateChannel);
          if (!channel || !channel.isTextBased()) continue;

          for (const server of config.serverMcConfig) {
            try {
              const serverType = server.type || 'java';
              const data = await getServerInfo(serverType, server.ip, server.port.toString())

              const isOnline = data && data.online !== false;

              fields.push({
                name: `${isOnline ? '🛡️' : '❌'} ${server.name}`,
                value: `IP: **${server.ip}:${server.port}** (${serverType.toUpperCase()})\n` +
                  (isOnline
                    ? `👥 Joueurs: ${data.players?.online || 0}/${data.players?.max || '?'}\n` +
                    `📋 MOTD: ${data.motd?.clean || 'Aucun'}\n` +
                    `\n` +
                    `--------------------\n`
                    : `Le serveur **${server.ip}:${server.port}** est **HORS LIGNE**.\n` +
                    `--------------------`
                  ),
                inline: false
              });
            } catch (err) {
              console.error(`❌ Erreur en récupérant le status de ${server.ip}:${server.port}`, err);
            }
          }
          if (fields.length > 0) {
            const embed = new EmbedBuilder()
              .setTitle("🌍 Status des serveurs Minecraft")
              .setDescription("Voici les informations sur les serveurs Minecraft que nous surveillons.")
              .setColor("Blurple")
              .addFields(fields)
              .setTimestamp();

            if (config.updateMessageId) {
              const message = await (channel as TextChannel).messages.fetch(config.updateMessageId);
              if (message) {
                await message.edit({ embeds: [embed] });
              } else {
                const newMessage = await (channel as TextChannel).send({ embeds: [embed] });
                await prisma.discordConfig.update({
                  where: { id: config.id },
                  data: { updateMessageId: newMessage.id }
                });
              }
            } else {
              const newMessage = await (channel as TextChannel).send({ embeds: [embed] });
              await prisma.discordConfig.update({
                where: { id: config.id },
                data: { updateMessageId: newMessage.id }
              });
            }
          }
        }
      } catch (err) {
        console.error('❌ Erreur dans la boucle de status update', err);
      }
    }, 60 * 1000);

    setInterval(async () => {
      const CheckerHourly: boolean = HourlyChecker();
      if (CheckerHourly) {
        const allGuilds = await prisma.discordConfig.findMany({
          include: {
            serverMcConfig: true
          }
        });
    
        for (const guild of allGuilds) {
          for (const server of guild.serverMcConfig) {
            await prisma.playerByHour.create({
              data: {
                hours: new Date().getHours().toString().padStart(2, '0'), 
                player: 0,
                serverId: server.id
              }
            });
          }
        }
    
        console.log("Entrées ajoutées pour tous les serveurs à l'heure pile.");
      }
    }, 1000)
  }
};
