import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../bot';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Hello!'),
  async execute(cmd: ChatInputCommandInteraction) {
    await cmd.reply({
      content: Bot.config.hello,
      ephemeral: true
    });
  }
};