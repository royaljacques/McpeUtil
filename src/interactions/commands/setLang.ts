import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Client, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { prisma } from '../../prisma';
import { logger } from '../../utils/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('setlang')
    .setDescription('Change la langue du serveur')
    .addStringOption(option =>
      option.setName('lang')
        .setDescription('Langue à définir')
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction, client: Client) {
    try {
      const guildId = interaction.guildId;
      if (!guildId) return;

      // Option pour la langue
      const langOption = interaction.options.getString('lang');
      if (langOption) {
        // Mise à jour de la langue dans la base de données
        await prisma.discordConfig.update({
          where: { discordId: guildId },
          data: { language: langOption }
        });

        await interaction.reply({
          content: `La langue du serveur a été mise à jour en ${langOption}.`,
          ephemeral: true
        });

        logger.info(`✅ Langue mise à jour pour le serveur ${guildId} vers ${langOption}`);
      } else {
        // Proposer la sélection des langues via un menu déroulant
        const langOptions = [
          { label: 'Français', value: 'fr_FR' },
          { label: 'Anglais', value: 'en_US' }
        ];

        const selectMenu = new MessageSelectMenu()
          .setCustomId('lang_select')
          .setPlaceholder('Choisissez une langue')
          .addOptions(langOptions);

        const row = new MessageActionRow().addComponents(selectMenu);

        await interaction.reply({
          content: 'Veuillez sélectionner la langue pour le serveur:',
          components: [row],
          ephemeral: true
        });
      }
    } catch (error) {
      logger.error(`❌ Erreur dans la commande /setlang:`, error);
      await interaction.reply({ content: 'Une erreur est survenue en essayant de changer la langue.', ephemeral: true });
    }
  }
};

export async function handleSelectMenu(interaction: CommandInteraction) {
  if (!interaction.isSelectMenu()) return;

  const selectedLang = interaction.values[0];
  const guildId = interaction.guildId;
  if (!guildId) return;

  // Mise à jour de la langue en fonction de la sélection
  try {
    await prisma.discordConfig.update({
      where: { discordId: guildId },
      data: { language: selectedLang }
    });

    await interaction.update({
      content: `La langue du serveur a été mise à jour en ${selectedLang === 'fr_FR' ? 'Français' : 'Anglais'}.`,
      components: []
    });

    logger.info(`✅ Langue mise à jour pour le serveur ${guildId} vers ${selectedLang}`);
  } catch (error) {
    logger.error(`❌ Erreur lors de la mise à jour de la langue :`, error);
    await interaction.update({ content: 'Une erreur est survenue en essayant de changer la langue.', components: [] });
  }
}
