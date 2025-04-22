import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config';
import { loadEvents } from './handlers/eventHandler';
import { loadInteractions } from './handlers/interactionHandler';
import { ExtendedClient } from './types/extendedClient';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
}) as ExtendedClient;
client.interactions = new Collection();
(async () => {
  await loadEvents(client);
  await loadInteractions(client);
  await client.login(config.token);
})();