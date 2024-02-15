import { Client, ClientOptions } from "discord.js";
import ready from "./event-listeners/ready";
import interactionCreate from "./event-listeners/interactionCreate";
require('dotenv').config();

console.log("Bot is starting...");

const client = new Client({
    intents: []
});
client.login(process.env.DISCORD_BOT_TOKEN);
ready(client);
interactionCreate(client);