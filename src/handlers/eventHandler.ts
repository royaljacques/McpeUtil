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
      const event = await import(filePath);
      const eventName = file.replace(/\.(ts|js)/, '');

      if (event && event.default) {
        const once = event.default.once;
        const execute = event.default.execute;

        if (once) {
          client.once(eventName, (...args) => execute(...args, client));
        } else {
          client.on(eventName, (...args) => execute(...args, client));
        }

        logger.info(`✅ Event chargé : ${eventName}`);
      }
    }
  }
}