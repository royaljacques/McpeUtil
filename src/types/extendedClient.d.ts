import { Client, Collection } from 'discord.js';

export interface ExtendedClient extends Client {
  interactions: Collection<string, any>;
}