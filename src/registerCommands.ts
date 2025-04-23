import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const commands: any[] = [];
const folders = ['commands'];

for (const folder of folders) {
  const commandFiles = readdirSync(path.join(__dirname, 'interactions', folder))
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'interactions', folder, file));
    if (command.default && command.default.data) {
      commands.push(command.default.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

(async () => {
  try {
    console.log('🚀 Début du refresh des commandes slash...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    );

    console.log('✅ Les commandes ont été enregistrées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l’enregistrement des commandes :', error);
  }
})();
