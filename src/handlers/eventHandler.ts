import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

export async function loadEvents(client: Client) {
  const eventFolders = readdirSync(path.join(__dirname, '..', 'events'));

  for (const folder of eventFolders) {
    const eventFiles = readdirSync(path.join(__dirname, '..', 'events', folder)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(__dirname, '..', 'events', folder, file);

      try {
        const event = await import(filePath);
        if (event && event.default) {
          const { name, once, execute } = event.default;

          if (!name || typeof execute !== 'function') {
            logger.error(`❌ L'événement dans le fichier ${file} est mal configuré.`);
            continue;
          }

          if (once) {
            client.once(name, (...args) => execute(...args, client));
          } else {
            client.on(name, (...args) => execute(...args, client));
          }

          logger.info(`✅ Event chargé : ${name}`);
        }
      } catch (error) {
        logger.error(`❌ Erreur lors du chargement de l'événement ${file}:`, error);
      }
    }
  }
}