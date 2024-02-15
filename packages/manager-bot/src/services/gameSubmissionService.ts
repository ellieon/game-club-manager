import { DatabaseService } from "../services/databaseService";
import { IGDBService } from "../services/igdbService";
import { Submission } from "../types/submission";

export class GameSubmissionService {
    constructor(
        private databaseService: DatabaseService = new DatabaseService(),
        private igdbService: IGDBService = new IGDBService(),
    ){};

    public async startNewSubmission(userId: string, title: string, description: string, challenge: string, platform: string, guild: string): Promise<any[]> {
        this.removeCurrentSubmissionsForUser(userId, guild)

        const submission: Submission = {
            user: userId,
            pending: true,
            date: new Date().toISOString(),
            guild: guild,
            info: {
                title: title,
                description: description,
                challenge: challenge,
                platform: platform,
            }
        }
        this.databaseService.startSubmissionForUser(submission);

        return this.igdbService.searchGame(title);
    }

    public async updatePendingSubmissionForUser(userId: string, gameid: string) {
        await this.databaseService.completeSubmissionForUser(gameid, userId);
    }

    public async removeCurrentSubmissionsForUser(userId: string, guild: string): Promise<void>{
        const lastSelection = await this.databaseService.getLastSelection(guild);
        if(lastSelection) {
            await this.databaseService.removeAllSubmissionsForUserFromDate(new Date(lastSelection.date), userId, guild);
        } else {
            await this.databaseService.removeAllSubmissionsForUser(userId, guild);
        }
        
    }
}