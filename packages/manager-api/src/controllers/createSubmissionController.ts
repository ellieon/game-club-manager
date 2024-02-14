import { Request } from "express";
import { UserService } from "../services/userService";
import { DatabaseService } from "../services/databaseService";

export class CreateSubmissionController {
    constructor(
        private userService = new UserService(),
        private databaseService = new DatabaseService()
    ){}

    public async createNewSubmission(req: Request): Promise<void> {
        if(!req.token) {
            throw Error('User token required to create submission');
        }
        const user = await this.userService.getUser(req.token);
        const submissionInfo = { 
            title: req.body.title,
            description: req.body.description,
            challenge: req.body.challenge,
            platform: req.body.platform,
        }

        await this.databaseService.addSubmission({
            userId: user.id,
            date: new Date().toISOString(),
            info: submissionInfo,
        })
    }
}