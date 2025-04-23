"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEvents = loadEvents;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
async function loadEvents(client) {
    const eventFolders = (0, fs_1.readdirSync)(path_1.default.join(__dirname, '..', 'events'));
    for (const folder of eventFolders) {
        const eventFiles = (0, fs_1.readdirSync)(path_1.default.join(__dirname, '..', 'events', folder)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path_1.default.join(__dirname, '..', 'events', folder, file);
            const event = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            const eventName = file.replace(/\.(ts|js)/, '');
            if (event && event.default) {
                const once = event.default.once;
                const execute = event.default.execute;
                if (once) {
                    client.once(eventName, (...args) => execute(...args, client));
                }
                else {
                    client.on(eventName, (...args) => execute(...args, client));
                }
                logger_1.logger.info(`✅ Event chargé : ${eventName}`);
            }
        }
    }
}
