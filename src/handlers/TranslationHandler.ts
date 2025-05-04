import fs from "fs";
import path from "path";
import { prisma } from '../prisma';
type Lang = "fr_FR" | "en_US"; 

export default class TranslationHandler {
  private translations: Record<Lang, Record<string, any>> = {
    fr_FR: {},
    en_US: {}
  };

  constructor(private supportedLangs: Lang[] = ["fr_FR", "en_US"]) {
    this.loadAllLanguages();
  }

  private loadAllLanguages() {
    for (const lang of this.supportedLangs) {
      const langPath = path.resolve(__dirname, "..", "config", "langages", lang);
      if (!fs.existsSync(langPath)) continue;

      const files = fs.readdirSync(langPath).filter(f => f.endsWith(".json"));

      for (const file of files) {
        const key = path.basename(file, ".json");
    
        const filePath = path.join(langPath, file);

        try {
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          if (!this.translations[lang][key]) {
            this.translations[lang][key] = {};
          }
          Object.assign(this.translations[lang][key], content);
        } catch (err) {
          console.error(`❌ Erreur de chargement du fichier ${filePath} :`, err);
        }
      }
    }
  }

  public t(lang: Lang, file: string, key: string): string {
    return (
      this.translations[lang]?.[file]?.[key] ||
      `❓ Traduction manquante: ${lang}.${file}.${key}`
    );
  }
  public async tForGuildDb(guildId: string, file: string, key: string): Promise<string> {
    const config = await prisma.discordConfig.findUnique({ where: { discordId: guildId } });
    const lang = (config?.language as Lang) || "en_US";
    return this.t(lang, file, key);
  }
}
