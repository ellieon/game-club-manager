import { Client, ClientOptions } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
require('dotenv').config();

console.log("Bot is starting...");

const client = new Client({
    intents: []
});
client.login(process.env.DISCORD_BOT_TOKEN);
ready(client);
interactionCreate(client);