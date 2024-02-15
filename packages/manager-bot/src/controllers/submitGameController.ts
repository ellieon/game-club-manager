import { Services } from "@game-club-manager/manager-api/";
import { Submission } from "@game-club-manager/manager-model/src";

export class SubmitGameController {
    constructor(
        private databaseService: Services.DatabaseService = new Services.DatabaseService(),
        private igdbService: Services.IGDBService = new Services.IGDBService(),
    ){};

    public async startNewSubmission(userId: string, title: string, description: string, challenge: string, platform: string): Promise<any[]> {
        this.removePendingSubmissionsForUser(userId);

        const submission: Submission = {
            id: userId,
            pending: true,
            date: new Date().toISOString(),
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
        this.databaseService.completeSubmissionForUser(gameid, userId);
    }

    public async removePendingSubmissionsForUser(userId: string): Promise<void>{
        this.databaseService.removePendingSubmissionsForUser(userId);
    }
}