import { ChatInputCommandInteraction, SlashCommandBuilder, Client, TextChannel } from 'discord.js';
import { prisma } from './../../prisma';

export default {
  data: new SlashCommandBuilder()
    .setName('setupchannel')
    .setDescription('Configurer le salon où les mises à jour des serveurs seront envoyées')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Sélectionnez le salon pour les mises à jour.')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    const guildId = interaction.guildId;
    if (!guildId) {
      await interaction.reply({
        content: '❌ Cette commande doit être utilisée dans un serveur Discord.',
        ephemeral: true
      });
      return;
    }

    const channel = interaction.options.getChannel('channel', true);

    try {
      let discordConfig = await prisma.discordConfig.findUnique({
        where: { discordId: guildId }
      });

      if (!discordConfig) {
        discordConfig = await prisma.discordConfig.create({
          data: {
            discordId: guildId,
            serverName: interaction.guild?.name ?? 'Nom inconnu',
            updateChannel: channel.id
          }
        });
      } else {
        await prisma.discordConfig.update({
          where: { discordId: guildId },
          data: { updateChannel: channel.id }
        });
      }

      await interaction.reply({
        content: `✅ Le salon de mise à jour est désormais configuré sur <#${channel.id}> !`,
        ephemeral: true
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Une erreur est survenue lors de la configuration du salon.',
        ephemeral: true
      });
    }
  }
};
