"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
// Correction du chemin absolu :
const botPath = path_1.default.join(__dirname, 'bot.js');
const manager = new discord_js_1.ShardingManager(botPath, {
    token: config_1.config.token,
    totalShards: 'auto',
});
manager.on('shardCreate', shard => {
    console.log(`🧩 Shard ${shard.id} lancé`);
});
manager.spawn();
