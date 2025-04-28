import { ChatInputCommandInteraction, SlashCommandBuilder, Client, TextChannel } from 'discord.js';
import { prisma } from './../../prisma';

export default {
  data: new SlashCommandBuilder()
    .setName('addserver')
    .setDescription('Ajouter un serveur Minecraft')
    .addStringOption(option =>
      option.setName("name")
        .setDescription("Nom du serveur")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("ip")
        .setDescription("IP du serveur")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("port")
        .setDescription("Port du serveur")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Type du serveur")
        .setRequired(true)
        .addChoices(
          { name: 'Java', value: 'java' },
          { name: 'Bedrock', value: 'bedrock' },
        )
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

    const name = interaction.options.getString('name', true);
    const ip = interaction.options.getString('ip', true);
    const port = interaction.options.getInteger('port', true);
    const type = interaction.options.getString('type', true); 

    try {
      const existingServer = await prisma.serverMcConfig.findFirst({
        where: {
          ip: ip,
          port: port,
          type: type, 
        }
      });

      if (existingServer) {
        await interaction.reply({
          content: `❌ Un serveur **${type.toUpperCase()}** avec l'IP **${ip}** et le port **${port}** existe déjà.`,
          ephemeral: true
        });
        return;
      }

      let discordConfig = await prisma.discordConfig.findUnique({
        where: { discordId: guildId }
      });

      if (!discordConfig) {
        discordConfig = await prisma.discordConfig.create({
          data: {
            discordId: guildId,
            serverName: interaction.guild?.name ?? 'Nom inconnu',
          },
        });
      }

      await prisma.serverMcConfig.create({
        data: {
          ip: ip,
          port: port,
          name: name,
          type: type,
          userId: discordConfig.id,
        }
      });

      await interaction.reply({
        content: `✅ Serveur **${name}** (${type.toUpperCase()}) ajouté avec succès !`,
        ephemeral: true
      });

      if (discordConfig.updateChannel) {
        const channel = await client.channels.fetch(discordConfig.updateChannel);
        if (channel && channel.isTextBased()) {
          (channel as TextChannel).send(`📢 Nouveau serveur **${name}** (${type.toUpperCase()}) ajouté à la liste !`);
        }
      } else {
        if (interaction.channel?.isTextBased()) {
          interaction.channel.send(`⚠️ Aucun channel d'update n'est configuré. Utilisez \`/setupchannel\` pour en définir un.`);
        }
      }

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Une erreur est survenue en ajoutant le serveur.',
        ephemeral: true
      });
    }
  }
};
