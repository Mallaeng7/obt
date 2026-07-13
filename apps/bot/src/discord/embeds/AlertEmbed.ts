import { EmbedBuilder } from 'discord.js';

export class AlertEmbed extends EmbedBuilder {
  constructor(title: string, description: string, type: 'alarm' | 'warning' = 'alarm') {
    super();
    this.setTitle(type === 'alarm' ? `🚨 ${title}` : `⚠️ ${title}`)
      .setColor(type === 'alarm' ? '#e74c3c' : '#f1c40f')
      .setDescription(description)
      .setTimestamp();
  }
}
