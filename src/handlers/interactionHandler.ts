import { Client, Collection, Interaction } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { ExtendedClient } from '../types/extendedClient';

export async function loadInteractions(client: ExtendedClient) {
  const folders = ['commands', 'buttons', 'modals', 'selectMenus', 'contextMenus'];

  for (const folder of folders) {
    const files = readdirSync(path.join(__dirname, '..', 'interactions', folder)).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    
    for (const file of files) {
      const filePath = path.join(__dirname, '..', 'interactions', folder, file);
      const interaction = await import(filePath);
      if (interaction && interaction.default && interaction.default.data.name) {
        if (!client.interactions) client.interactions = new Collection();
        client.interactions.set(interaction.default.data.name, interaction.default);
        logger.info(`🧩 Interaction chargée (${folder}) : ${interaction.default.data.name}`);
      }
    }
  }

  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      const name = interaction.isCommand()
        ? interaction.commandName
        : interaction.isButton()
        ? interaction.customId
        : interaction.isSelectMenu()
        ? interaction.customId
        : null;
      if (!name) return;
      const handler = client.interactions?.get(name);
      if (!handler) return;
      await handler.execute(interaction, client);
    } catch (err) {
      logger.error(`❌ Erreur interaction :`, err);
    }
  });
}