import { ComponentType, Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
CacheType, StringSelectMenuInteraction, ButtonInteraction} from "discord.js";
import { Handler } from "./interactionHandler";
import { GameSubmissionService } from "../services/gameSubmissionService";
import { error } from "console";
import { UserInteraction } from "../types/userInteraction";
import { truncateMiddle } from "../util/truncateMiddle";
import { DatabaseService } from "../services/databaseService";

export class ReccomendationFormSubmitHandler implements Handler {
    name: string =  "gameSubmission"

    constructor(
        private gameSubmissionService: GameSubmissionService = new GameSubmissionService(),
        private databaseService: DatabaseService = new DatabaseService(),
    ){}

    public async run (client: Client, interaction: UserInteraction) {
        
        if (!interaction.isModalSubmit()) {
            throw error("Expecting modal submit interaction");
        }

        if (!interaction.inGuild()) {
            await interaction.reply({
                content: 'I can only perform this command in a server',
                ephemeral: true
            })
            return
        }

        await interaction.deferReply({ ephemeral: true });

        const title = interaction.fields.getTextInputValue('titleInput');
        const desc = interaction.fields.getTextInputValue('descriptionInput');
        const challenge = interaction.fields.getTextInputValue('challengeInput');
        const platform = interaction.fields.getTextInputValue('platformInput');

        let games = await this.gameSubmissionService.startNewSubmission(interaction.user.id, title, desc, challenge, platform, interaction.guildId);

        const options: StringSelectMenuOptionBuilder[] = []

        if (games.length > 24) {
            games = games.slice(0, 24);
        }

        if (games.length === 0) {
            await this.databaseService.removePendingSubmissionsForUser(interaction.user.id, interaction.guildId);
            await interaction.followUp({
                content: 'I was unable to find any games by that title',
                ephemeral: true,
            });
        } else {
            const { row, cancelRow } = this.buildForm(games, options);

            const response = await interaction.followUp({
                content: 'Please confirm your game from the list:',
                components: [row, cancelRow],
                ephemeral: true,
            });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect });
            const buttonCollector = response.createMessageComponentCollector({ componentType: ComponentType.Button });

            collector.on('collect', (i) => this.onStringSelected(i));
            buttonCollector.on('collect', (i) =>  this.onCancelPressed(i));
        }
    }

    private async onStringSelected (interaction: StringSelectMenuInteraction<CacheType>): Promise<void>{
        const id = interaction.values[0];
        await this.gameSubmissionService.updatePendingSubmissionForUser(interaction.user.id, id);
        await interaction.update({
            content: 'Confirmed, your submission has been accepted.',
            components: []
        });
    }

    private async onCancelPressed (interaction: ButtonInteraction<CacheType>): Promise<void> {
        if(interaction.inGuild()) {
            await this.databaseService.removePendingSubmissionsForUser(interaction.user.id, interaction.guildId);
        }
        await interaction.update({
            content: "Ok, I've cancelled your submission",
            components: []
       });
    }

    private buildForm(games: any[], options: StringSelectMenuOptionBuilder[]) {
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
};


