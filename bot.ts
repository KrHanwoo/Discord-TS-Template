import { Client } from "discord.js";
import config from "./config.json";
import dotenv from "dotenv";
import { Manager } from "./utils/manager";

dotenv.config();

const client = new Client({
  intents: [
    // GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.DirectMessages,
    // GatewayIntentBits.GuildVoiceStates,
    // GatewayIntentBits.GuildPresences,
    // GatewayIntentBits.MessageContent
    // ...Etc
  ]
});

export const Bot = { config, client };

(async () => {
  console.log(new Date());
  await Manager.init();
  await client.login(process.env.BOT_TOKEN);
  console.log(`Logged as ${Bot.client.user.username}`);
})();