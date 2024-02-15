import { ModalSubmitInteraction, ComponentType, Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

import { Handler } from "../interactionHandler";
import { Services } from "@game-club-manager/manager-api/";
import { SubmitGameController } from "../../controllers/submitGameController";
import { UserInteraction } from "../../event-listeners/interactionCreate";
import { error } from "console";

function truncateMiddle(input: string, targetLength: number): string {
    if (input.length <= targetLength) {
        return input;
    }

    const start = Math.floor((targetLength - 3) / 2);
    const end = input.length - targetLength + start + 3;

    return input.substring(0, start) + '...' + input.substring(end);
}

export const ReccomendationFormSubmitHandler: Handler = {
    name: "reccomendationModal",
    run: async (client: Client, interaction: UserInteraction) => {
        if (!interaction.isModalSubmit()) {
            throw error("Expecting modal submit interaction");
        }

        await interaction.deferReply({ ephemeral: true });

        const title = interaction.fields.getTextInputValue('titleInput');
        const desc = interaction.fields.getTextInputValue('descriptionInput');
        const challenge = interaction.fields.getTextInputValue('challengeInput');
        const platform = interaction.fields.getTextInputValue('platformInput');

        const submitGameController: SubmitGameController = new SubmitGameController();
        let games = await submitGameController.startNewSubmission(interaction.user.id, title, desc, challenge, platform);

        const options: StringSelectMenuOptionBuilder[] = []

        if (games.length > 24) {
            games = games.slice(0, 24);
        }

        if (games.length === 0) {
            await submitGameController.removePendingSubmissionsForUser(interaction.user.id);
            await interaction.followUp({
                content: 'I was unable to find any games by that title',
                ephemeral: true,
            });
        } else {
            const { row, cancelRow } = buildForm(games, options);

            const response = await interaction.followUp({
                content: 'Please confirm your game from the list:',
                components: [row, cancelRow],
                ephemeral: true,
            });


            const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
            const buttonCollector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });

            collector.on('collect', async i => {
                const id = i.values[0];
                await submitGameController.updatePendingSubmissionForUser(i.user.id, id);
	            await i.update({
                    content: 'Confirmed, your submission has been accepted.',
                    components: []
                });
            });

            buttonCollector.on('collect', async i => {
                await submitGameController.removePendingSubmissionsForUser(i.user.id);
                await i.update({
                    content: "Ok, I've cancelled your submission",
                    components: []
               });
            });
            
        }
    }
};

function buildForm(games: any[], options: StringSelectMenuOptionBuilder[]) {
    games.forEach(game => {
        const date = new Date(0);
        date.setUTCSeconds(game.first_release_date);
        options.push(new StringSelectMenuOptionBuilder()
            .setLabel(truncateMiddle(`${game.name} (${date.getFullYear()})`, 40))
            .setValue(game.id.toString()));
    });
    const select = new StringSelectMenuBuilder()
        .setCustomId('selectGame')
        .setPlaceholder('Make a selection!')
        .addOptions(options);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(select);

    const cancel = new ButtonBuilder()
        .setCustomId('cancelGame')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

    const cancelRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(cancel);
    return { row, cancelRow };
}
