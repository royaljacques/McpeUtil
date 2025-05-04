import { TextChannel, EmbedBuilder, Client } from "discord.js";
import config from "./../config/channels.json"; 
import { config as appConfig } from "./../config"; // Import du fichier config.ts

const requiredChannels: ErrorType[] = ["success", "error", "warning"];

for (const type of requiredChannels) {
  if (!config.channels[type]) {
    console.warn(`⚠️ Le salon pour le type "${type}" n'est pas configuré dans channels.json.`);
  }
}

type ErrorType = "success" | "error" | "warning";

interface ErrorMessage {
  type: ErrorType;
  message: string;
}

export default class ErrorHandler {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async handleError({ type, message }: ErrorMessage): Promise<void> {
    const colorMap: Record<ErrorType, number> = {
      success: 0x57F287,
      warning: 0xFAA61A,
      error: 0xED4245
    };

    const channelId = config.channels[type];

    if (!channelId) {
      console.error(`❌ Aucun salon configuré pour le type "${type}"`);
      return;
    }

    const guildId = appConfig.DISCORD_DEV_ID; // Récupération de l'ID du Discord depuis config.ts
    const guild = this.client.guilds.cache.get(guildId);
    
    if (!guild) {
      console.error(`❌ Impossible de trouver le serveur avec l'ID "${guildId}"`);
      return;
    }

    const channel = guild.channels.cache.get(channelId) as TextChannel;

    if (!channel || !channel.isTextBased()) {
      console.error(`❌ Salon non trouvé ou invalide pour le type "${type}"`);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(type.toUpperCase())
      .setDescription(message)
      .setColor(colorMap[type])
      .setTimestamp();

    try {
      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("❌ Impossible d'envoyer le message :", err);
    }
  }
}
