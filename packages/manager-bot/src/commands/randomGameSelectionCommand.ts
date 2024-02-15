import { CommandInteraction, Client, Message, PermissionFlagsBits, bold, italic, strikethrough, underscore, spoiler, quote, codeBlock, EmbedBuilder, AttachmentBuilder} from "discord.js";
import { ApplicationCommandType } from "discord.js";
import { Command } from "./command";
import { DatabaseService } from "../services/databaseService";
import { IGDBService } from "../services/igdbService";
import { randomBetween } from "../util/randomBetween";
import { Submission } from "../types/submission";
import { getRequiredEnvVar } from "../util/getRequiredEnvVar";


var template = `-----
${underscore(italic(bold('Title')))}
Suggested by: <@SuggestedT>

${underscore(bold('Why did you choose this game'))}
* Description

${underscore(bold('Challenge'))}
* 'ChallengeT'
`;

export class RandomGameSelectionCommand implements Command {
    name: string = "drawgame";
    description: string = "Draw a game at random";
    type?: ApplicationCommandType.ChatInput =  ApplicationCommandType.ChatInput;

    constructor(
        private databaseService: DatabaseService = new DatabaseService(),
        private igdbService: IGDBService = new IGDBService(),
    ) {
    }

    public async run (client: Client, interaction: CommandInteraction)  {
        if(!interaction.inGuild()) {
            await interaction.reply({
                ephemeral: true,
                content: 'This command can only be run in a server',
            });
            return
        }

        if(interaction.user.id !== getRequiredEnvVar('ADMIN_USER')) {
            await interaction.reply({
                ephemeral: true,
                content: 'This command can only be run by admin',
            });
            return
        }

        await interaction.deferReply({
            ephemeral: false,
        });


        const lastSelection = await this.databaseService.getLastSelection(interaction.guildId);
        let submissions: Submission[] = []
        if(lastSelection) {
            submissions = await this.databaseService.getSubmissionsForGuildFromDate(new Date(lastSelection.date), lastSelection.guild);
        } else {
            submissions = await this.databaseService.getSubmissionsForGuild(interaction.guildId);
        }
        

        if(submissions.length === 0) {
            await interaction.followUp({
                ephemeral: false,
                content: 'There have been no submissions since the last selection'
            });
            return;
        }
    
        let content = template;
        const selection: Submission = submissions[randomBetween(0, submissions.length)]


        const game = selection.gameid ? await this.igdbService.getGame(selection.gameid) : (await this.igdbService.searchGame(selection.info.title))[0];

        //Setup Cover Embed
        const cover = selection.gameid ? await this.igdbService.getCover(selection.gameid) : await this.igdbService.searchCoverForGameTitle(selection.info.title);
        const coverUrl = cover ? await this.igdbService.getImage(cover.image_id): undefined;
        const gameEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(game.name)
        .setDescription(game.summary);

        if(coverUrl) {
            gameEmbed.setImage(coverUrl);
        }

        //Setup Screenshot Attachments
        const screenshots = await this.igdbService.getScrenshotsForGame(game);
        const promises = screenshots.map(screenshot => this.igdbService.getScreenshotImage(screenshot.image_id));
        const screenshotUrls = await Promise.all(promises);
        const screenshotAttachments = screenshotUrls.map(url => new AttachmentBuilder(url));

        //Build Content paragraph from template
        content = content.replace('ChallengeT', selection.info.challenge === undefined ? '' : selection.info.challenge);
        content = content.replace('Title', game.name);
        content = content.replace('Description', selection.info.description);
        content = content.replace('SuggestedT', selection.user);

        await interaction.followUp({
            ephemeral: false,
            content,
        });
        
        await interaction.followUp({
            ephemeral: false,
            embeds: [gameEmbed],
        });
        
        if (screenshotAttachments.length > 0) {
            await interaction.followUp({
                ephemeral: false,
                files: screenshotAttachments,
            });
        }
        await this.databaseService.createSelection(selection);
    }
};