"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const FcmListener_1 = require("../../core/FcmListener");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('credentials')
        .setDescription('Manage Rust+ FCM Credentials')
        .addSubcommand(subcommand => subcommand
        .setName('add')
        .setDescription('Add FCM credentials from a raw string')
        .addStringOption(option => option.setName('data')
        .setDescription('Raw credential string (e.g. gcm_android_id:123...)')
        .setRequired(true))),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'add') {
            const dataString = interaction.options.getString('data', true);
            // Parse the format: key:value key:value ...
            const pairs = dataString.split(' ');
            const parsed = {};
            for (const pair of pairs) {
                const [key, value] = pair.split(':');
                if (key && value) {
                    parsed[key.trim()] = value.trim();
                }
            }
            if (!parsed['gcm_android_id'] || !parsed['gcm_security_token']) {
                await interaction.followUp('❌ Invalid format. Missing gcm_android_id or gcm_security_token.');
                return;
            }
            const credentials = {
                gcm: {
                    androidId: parsed['gcm_android_id'],
                    securityToken: parsed['gcm_security_token']
                },
                keys: {
                    // Dummy keys since we only need GCM for receiving
                    privateKey: "dummy",
                    publicKey: "dummy",
                    authSecret: "dummy"
                },
                fcm: {
                    token: "dummy"
                }
            };
            // Save to file
            const credPath = path_1.default.join(__dirname, '../../../../../fcm-credentials.json');
            fs_1.default.writeFileSync(credPath, JSON.stringify(credentials, null, 2), 'utf8');
            // Start listener dynamically
            await FcmListener_1.fcmListener.start(credentials);
            await interaction.followUp(`✅ Successfully parsed and saved FCM credentials. Push receiver started!`);
        }
    }
};
