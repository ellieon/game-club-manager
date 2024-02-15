import { CommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder} from "discord.js";
import {ApplicationCommandType} from "discord.js";
import { Command } from "./command";

export const ReccomendGameCommand: Command = {
    name: "gameclubreccomend",
    description: "Creates a request for a game club reccomendation",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction:CommandInteraction) => {
	// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('reccomendationModal')
			.setTitle('Reccomend a game for game club');

		// Add components to modal

		// Create the text input components
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('titleInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What is the title of the game?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('descriptionInput')
			.setLabel("What is it you like about this game?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);
		
        const challengeInput = new TextInputBuilder()
			.setCustomId('challengeInput')
			.setLabel("Give us a challenge to complete in this game")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph) 

        const platformInput = new TextInputBuilder()
			.setCustomId('platformInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What platform(s) should we play on?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(challengeInput);
		const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(platformInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
        
    }
};