import { ChatInputCommandInteraction, SlashCommandBuilder, Client, TextChannel } from 'discord.js';
import { prisma } from './../../prisma';

export default {
  data: new SlashCommandBuilder()
    .setName('addserver')
    .setDescription('Ajouter un serveur')
    .addStringOption(option =>
      option.setName("name").setDescription("Nom du serveur").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("ip").setDescription("IP du serveur").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("port").setDescription("Port du serveur").setRequired(true)
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
    const portStr = interaction.options.getString('port', true);
    const port = parseInt(portStr, 10);

    try {
      const existingServer = await prisma.serverMcConfig.findFirst({
        where: {
          ip: ip,
          port: port
        }
      });
      
      if (existingServer) {
        await interaction.reply({
          content: `❌ Un serveur avec l'IP **${ip}** et le port **${port}** existe déjà dans la base de données.`,
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
          userId: discordConfig.id,
        }
      });

      await interaction.reply({
        content: `✅ Serveur **${name}** ajouté avec succès pour ce serveur Discord !`,
        ephemeral: true
      });
      
      if (discordConfig.updateChannel) {
        const channel = await client.channels.fetch(discordConfig.updateChannel);
        if (channel && channel.isTextBased()) {
          (channel as TextChannel).send(`📢 Un nouveau serveur **${name}** vient d'être ajouté à la liste !`);
        }
      } else {
        if (interaction.channel?.isTextBased()) {
          interaction.channel.send(`⚠️ Aucun channel d'update n'est configuré. Veuillez utiliser la commande \`/setupchannel\` pour en définir un.`);
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
