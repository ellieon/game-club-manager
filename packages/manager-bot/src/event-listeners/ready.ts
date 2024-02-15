import { Client } from "discord.js";
import { Commands } from "../commands/commands";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands);


        console.log(`${client.user.username} is online`);


        if (process.env.UPDATE_GUILD_COMMANDS) {

            (async () => {
                try {
                    console.log('Started refreshing application (/) commands.');
                    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);
                    await rest.put(
                        Routes.applicationGuildCommands(process.env.GUILD_CLIENT_ID, process.env.GUILD_ID),
                        { body: Commands },
                    );

                    console.log('Successfully reloaded application (/) commands.');
                } catch (error) {
                    console.error(error);
                }
            })();

        }
    });
};