import { Request } from "express";
import { UserService } from "../services/userService";
import { DatabaseService } from "../services/databaseService";
import { GameClubManager } from '@game-club-manager/manager-model';

export class ListSubmissionsController {
    constructor(
        private userService = new UserService(),
        private databaseService = new DatabaseService()
    ){}

    public async getSubmissions(): Promise<GameClubManager.Submission[]> {
        return await this.databaseService.getSubmissions();
    }
}