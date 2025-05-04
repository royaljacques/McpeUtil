import { Client, Events, EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '../../prisma';
import { logger } from '../../utils/logger';
import { HourlyChecker } from '../../utils/date';
import getServerInfo from '../../utils/serverPing';
import { format } from 'date-fns';
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

        for (const config of configs) {
          if (!config.updateChannel) continue;

          const channel = await client.channels.fetch(config.updateChannel);
          if (!channel || !channel.isTextBased()) continue;

          const fields: any[] = [];

          for (const server of config.serverMcConfig) {
            try {
              const serverType = server.type || 'java';
              const data = await getServerInfo(serverType, server.ip, server.port.toString());

              const isOnline = data && data.online !== false;

              fields.push({
                name: `${isOnline ? '🛡️' : '❌'} ${server.name}`,
                value: `IP: **${server.ip}:${server.port}** (${serverType.toUpperCase()})\n` +
                  (isOnline
                    ? `👥 Joueurs: ${data.players?.online || 0}/${data.players?.max || '?'}\n` +
                    `📋 MOTD: ${data.motd?.clean || 'Aucun'}\n` +
                    `--------------------`
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
              try {
                const message = await (channel as TextChannel).messages.fetch(config.updateMessageId);
                if (message) {
                  await message.edit({ embeds: [embed] });
                  console.log(`📝 Message modifié pour le serveur ${config.serverName}`);
                  continue;
                }
              } catch (err) {
                console.warn('⛔ Message introuvable ou supprimé, envoie d\'un nouveau.', err);
              }
            }

            const newMessage = await (channel as TextChannel).send({ embeds: [embed] });
            await prisma.discordConfig.update({
              where: { id: config.id },
              data: { updateMessageId: newMessage.id }
            });
          }
        }
      } catch (err) {
        console.error('❌ Erreur dans la boucle de status update', err);
      }
      console.log("update");
    }, 5000);

    let alreadyChecked = false;

    setInterval(async () => {
      const now = new Date();

      if (now.getMinutes() === 0 && !alreadyChecked) {
        alreadyChecked = true;

        const allGuilds = await prisma.discordConfig.findMany({
          include: {
            serverMcConfig: true
          }
        });

        const hourStr = format(now, 'HH:00');

        for (const guild of allGuilds) {
          for (const server of guild.serverMcConfig) {
            try {
              const serverType = server.type || 'java';
              const data = await getServerInfo(serverType, server.ip, server.port.toString());
              const playerCount = data?.players?.online || 0;

              await prisma.playerByHour.create({
                data: {
                  hours: hourStr,
                  player: playerCount,
                  serverId: server.id,
                  createdAt: now
                }
              });

            } catch (err) {
              console.error(`Erreur en récupérant les joueurs du serveur ${server.ip}:${server.port}`, err);
            }
          }
        }
      }

      if (now.getMinutes() !== 0) {
        alreadyChecked = false;
      }
    }, 1000 * 10);
  }
};
