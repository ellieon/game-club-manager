import { CommandInteraction, Client, ModalBuilder, TextInputBuilder, ButtonInteraction, CacheType, TextInputStyle, ComponentType, ActionRowBuilder, ModalActionRowComponentBuilder, ButtonBuilder, ButtonStyle, MessageComponentInteraction } from "discord.js";
import { ApplicationCommandType } from "discord.js";
import { Command } from "./command";
import { DatabaseService } from "../services/databaseService";
import { Submission } from "../types/submission";


export class ReccomendGameCommand implements Command {
	name: string = "gameclubreccomend";
	description: string = "Creates a request for a game club reccomendation";
	type?: ApplicationCommandType.ChatInput = ApplicationCommandType.ChatInput;

	constructor(
		private databaseService: DatabaseService = new DatabaseService(),
	) { }

	public async run(client: Client, interaction: CommandInteraction) {
		if (!interaction.inGuild()) {
			await interaction.reply({
				ephemeral: true,
				content: 'This command can only be run in a server',
			})

			return
		}

		const getCurrentUserSubmission = await this.getCurrentUserSubmission(interaction.user.id, interaction.guildId);

		if (getCurrentUserSubmission) {
			await this.buildConfirmationDialog(interaction, getCurrentUserSubmission);

		} else {
			await this.buildAndDisplayModal(interaction);
		}
	}
	

	private async buildConfirmationDialog(interaction: CommandInteraction, submission: Submission) {
		const yesButton = new ButtonBuilder()
			.setCustomId('yesButton')
			.setLabel('Yes')
			.setStyle(ButtonStyle.Danger);

		const noButton = new ButtonBuilder()
			.setCustomId('noButton')
			.setLabel('No')
			.setStyle(ButtonStyle.Secondary);


		const buttonRow = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(noButton, yesButton);

		const response = await interaction.reply({
			content: 'Would you like to override your current suggestion ' + submission.info.title,
			components: [buttonRow],
			ephemeral: true,
		});

		const buttonCollector = response.createMessageComponentCollector({ componentType: ComponentType.Button });
         buttonCollector.on('collect', (i) =>  this.onButtonPressed(i));
	}

	private async onButtonPressed (interaction: ButtonInteraction<CacheType>): Promise<void> {

		if(interaction.customId === 'noButton') {
			await interaction.update({
				content: "Ok, I've cancelled your submission",
				components: []
		   });
		} else {
			await this.buildAndDisplayModal(interaction);
		}
        
    }

	private async getCurrentUserSubmission(userId: string, guildId: string): Promise<Submission | undefined> {

		const lastSelection = await this.databaseService.getLastSelection(guildId);
		let submissions = []
		if (lastSelection) {
			submissions = await this.databaseService.getSubmissionsForUserFromDate(new Date(lastSelection.date), userId, guildId);
		} else {
			submissions = await this.databaseService.getSubmissionsForUser(userId, guildId);
		}

		if (submissions.length === 0) {
			return undefined
		}

		return submissions[0];
	}

	private async buildAndDisplayModal(interaction: CommandInteraction | MessageComponentInteraction ) {
		const modal = new ModalBuilder()
			.setCustomId('gameSubmission')
			.setTitle('Reccomend a game for game club');

		const titleInput = new TextInputBuilder()
			.setCustomId('titleInput')
			.setLabel("What is the title of the game?")
			.setStyle(TextInputStyle.Short);

		const descriptionInput = new TextInputBuilder()
			.setCustomId('descriptionInput')
			.setLabel("What is it you like about this game?")
			.setStyle(TextInputStyle.Paragraph);

		const challengeInput = new TextInputBuilder()
			.setCustomId('challengeInput')
			.setLabel("Give us a challenge to complete in this game")
			.setStyle(TextInputStyle.Paragraph);

		const platformInput = new TextInputBuilder()
			.setCustomId('platformInput')
			.setLabel("What platform(s) should we play on?")
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
		const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);
		const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(challengeInput);
		const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(platformInput);

		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
		await interaction.showModal(modal);
	}
};


