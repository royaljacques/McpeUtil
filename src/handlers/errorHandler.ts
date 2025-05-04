import { TextChannel, EmbedBuilder, Guild } from "discord.js";
import config from "./../config/channels.json"; // chemin relatif à adapter

type ErrorType = "success" | "error" | "warning";

interface ErrorMessage {
  type: ErrorType;
  message: string;
  guild: Guild;
}

export default class ErrorHandler {
  public async handleError({ type, message, guild }: ErrorMessage): Promise<void> {
    const colorMap: Record<ErrorType, number> = {
      success: 0x57F287,
      warning: 0xFAA61A,
      error: 0xED4245
    };

    const channelId = config.channels[type]; // On lit depuis config.json

    if (!channelId) {
      console.error(`❌ Aucun salon configuré pour le type "${type}"`);
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
