import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('credentials')
    .setDescription('Manage Rust+ FCM Credentials')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Register your Steam auth token to receive Rust+ push notifications')
        .addStringOption(option =>
          option.setName('token')
            .setDescription('Your Rust+ Steam auth token')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check FCM listener status')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'add') {
      const authToken = interaction.options.getString('token', true);

      try {
        await interaction.followUp('⏳ Registering with FCM and Rust+ Companion API... This may take a moment.');

        const { fcmListener } = await import('../../core/FcmListener');
        await fcmListener.restartWithAuthToken(authToken);

        await interaction.followUp(
          '✅ **Successfully registered!**\n\n' +
          '📡 The bot is now listening for Rust+ push notifications.\n' +
          '🎮 Go in-game and click **"Pair with Server"** — the pairing request will appear in the `#servers` channel.\n\n' +
          '> 💡 This setup only needs to be done once. The credentials are saved for future restarts.'
        );
      } catch (error: any) {
        console.error('[Credentials] Setup failed:', error);
        await interaction.followUp(`❌ Failed to register: ${error.message}`);
      }
    }

    if (subcommand === 'status') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const configPath = path.join(__dirname, '../../../../../rustplus.config.json');

        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          const hasFcm = !!config.fcm_credentials;
          const hasExpo = !!config.expo_push_token;
          const hasAuth = !!config.rustplus_auth_token;

          await interaction.followUp(
            '📊 **FCM Status**\n' +
            `• FCM Credentials: ${hasFcm ? '✅ Registered' : '❌ Not registered'}\n` +
            `• Expo Push Token: ${hasExpo ? '✅ Obtained' : '❌ Missing'}\n` +
            `• Steam Auth Token: ${hasAuth ? '✅ Linked' : '❌ Not linked'}\n` +
            `• Status: ${hasFcm && hasExpo && hasAuth ? '🟢 **Active** — listening for push notifications' : '🔴 **Inactive** — use `/credentials add` to set up'}`
          );
        } else {
          await interaction.followUp(
            '📊 **FCM Status**\n' +
            '🔴 Not configured. Use `/credentials add` with your Steam auth token to set up.'
          );
        }
      } catch (error: any) {
        await interaction.followUp(`❌ Error checking status: ${error.message}`);
      }
    }
  }
};
