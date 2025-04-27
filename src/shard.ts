import { ShardingManager } from 'discord.js';
import { config } from './config';
import path from 'path';
import { fileURLToPath } from 'url';

const botPath = path.join(__dirname, 'bot.js');

const manager = new ShardingManager(botPath, {
  token: config.token,
  totalShards: 'auto',
});


manager.on('shardCreate', shard => {
  console.log(`🧩 Shard ${shard.id} lancé`);
});

manager.spawn();
