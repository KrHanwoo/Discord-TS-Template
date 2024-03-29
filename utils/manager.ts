import fs from "fs";
import { Bot } from "../bot";
import path from "path";
import { Util } from "./util";
import { REST, Routes } from "discord.js";

const map = new Map();

export class Manager {

  static async init() {
    registerEvents();
    await registerCommands();
  }
}

function registerEvents() {
  for (let f of getFiles("events")) {
    if (!Util.isScript(f)) continue;
    const event = require(f);
    Bot.client.on(event.event, (...args) => event.execute(...args));
  }
}

async function registerCommands() {
  let commands = [];

  for (let f of getFiles("interactions")) {
    if (!Util.isScript(f)) continue;
    let interaction = require(f);
    let fn = interaction.execute;
    let data = interaction.data;
    if (data) {
      map.set(data.name, fn);
      commands.push(data.toJSON());
    } else map.set(interaction.id, fn);
  }

  const rest = new REST().setToken(process.env.BOT_TOKEN);
  await rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: commands });

  Bot.client.on("interactionCreate", async (interaction: any) => {
    let key = interaction.commandName ?? interaction.customId;
    let fn = map.get(key);
    fn(interaction);
  });
}

function* getFiles(dir: string): Generator<string> {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) yield* getFiles(path.resolve(dir, file.name));
    else yield path.resolve(dir, file.name);
  }
}