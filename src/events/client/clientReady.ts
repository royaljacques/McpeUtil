import { Client, Events } from 'discord.js';
import { prisma } from '../../prisma';
import { logger } from '../../utils/logger';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log("✅ Client prêt :", client.user?.tag);
    logger.info(`✅ Connecté en tant que ${client.user?.tag}`);
  }
};