"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const eventHandler_1 = require("./handlers/eventHandler");
const interactionHandler_1 = require("./handlers/interactionHandler");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
client.interactions = new discord_js_1.Collection();
(async () => {
    await (0, eventHandler_1.loadEvents)(client);
    await (0, interactionHandler_1.loadInteractions)(client);
    await client.login(config_1.config.token);
})();
