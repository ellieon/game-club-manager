require('dotenv').config();
import { Client } from "discord.js";
import ready from "./event-listeners/ready";
import interactionCreate from "./event-listeners/interactionCreate";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

client.login(process.env.DISCORD_BOT_TOKEN);
ready(client);
interactionCreate(client);