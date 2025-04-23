import { ChatInputCommandInteraction, SlashCommandBuilder, Client } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Répond avec Pong!'),
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    await interaction.reply('🏓 Pong!');
  }
};