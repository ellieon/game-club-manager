import { CommandInteraction, Client, Interaction, ModalSubmitInteraction, ButtonInteraction, BaseInteraction  } from "discord.js";
import { Commands } from "../commands/commands";
import { Handlers } from "../interaction-handlers/handlers";
import { Handler } from "../interaction-handlers/interactionHandler";
import { UserInteraction } from "../types/userInteraction";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        try {
            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                await handleSlashCommand(client, interaction);
            }
            
            if (interaction.isModalSubmit() || interaction.isButton() || interaction.isStringSelectMenu()) {
                await handleModalSubmit(client, interaction);
            }
        } catch (err) {
            //TODO: Error logging
            console.log(err);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.reply({ content: "I was unable to execute that command" });
        return;
    }

    slashCommand.run(client, interaction);
};

const handleModalSubmit = async (client: Client, interaction: UserInteraction ): Promise<void> => {
    const slashCommand = Handlers.find((h: Handler) => h.name === interaction.customId);
    if (!slashCommand) {
        return;
    }

    slashCommand.run(client, interaction);
};