import { CommandInteraction, Client, Message, PermissionFlagsBits, bold, italic, strikethrough, underscore, spoiler, quote, codeBlock, EmbedBuilder, AttachmentBuilder} from "discord.js";
import {ApplicationCommandType} from "discord.js";
import { Command } from "./command";
import { Services } from "@game-club-manager/manager-api/";
import { Submission } from "@game-club-manager/manager-model/src";


var template = `-----
${underscore(italic(bold('Title')))}
Suggested by: <@SuggestedT>

${underscore(bold('Why did you choose this game'))}
* Description

${underscore(bold('Challenge'))}
* 'ChallengeT'
`;
function between(min: number, max: number) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }
  

export const RandomGameSelectionCommand: Command = {
    name: "drawgame",
    description: "Draw a game at random",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction:CommandInteraction) => {
        await interaction.reply({
            ephemeral: false,
            content: 'Here is the game for this game club:',
        });
        const databaseService = new Services.DatabaseService();
        const igdbService = new Services.IGDBService();
        const submissions = await databaseService.getSubmissions();
    

        let content = template;
        const sub: Submission = submissions[between(0, submissions.length)]

        const game = sub.gameid ? await igdbService.getGame(sub.gameid) : (await igdbService.searchGame(sub.info.title))[0];
        const cover = sub.gameid ? await igdbService.getCover(sub.gameid) : await igdbService.searchCoverForGameTitle(sub.info.title);
        const screenshots = await igdbService.getScrenshotsForGame(game);
        const coverUrl = await igdbService.getImage(cover.image_id);
        
        const promises: Promise<string>[] = screenshots.map(screenshot => igdbService.getScreenshotImage(screenshot.image_id));

        const screenshotUrls = await Promise.all(promises);

        content = content.replace('ChallengeT', sub.info.challenge === undefined ? '' : sub.info.challenge);
        content = content.replace('Title', game.name);
        content = content.replace('Description', sub.info.description);
        content = content.replace('SuggestedT', sub.id);

        const attachments = screenshotUrls.map(url => new AttachmentBuilder(url));
        const exampleEmbed = new EmbedBuilder()
	    .setColor(0x0099FF)
        .setImage(coverUrl)
	    .setTitle(game.name)
	    .setDescription(game.summary)
	
        await interaction.followUp({
            ephemeral: false,
            content,
        });

        await interaction.followUp({
            ephemeral: false,
            embeds:[exampleEmbed],
        });

        await interaction.followUp({
            ephemeral: false,
            files:attachments,
        });
    }
};