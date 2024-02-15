import { Pool } from 'pg'
import { getRequiredEnvVar } from '../util/getRequiredEnvVar';
import { GameClubManager } from '@game-club-manager/manager-model';

export class DatabaseService {
    constructor(private pool: Pool = new Pool({connectionString: getRequiredEnvVar('DATABASE_URL')})){
    }

    public async addSubmission(submission: GameClubManager.Submission) {
        const query = 'INSERT INTO submissions(date, id, info, gameid, pending) VALUES($1, $2, $3, $4, $5)';
        const values = [submission.date, submission.id, submission.info, submission.gameid, false];
        await this.pool.query(query, values);
    }

    public async getSubmissions(): Promise<GameClubManager.Submission[]> {
        const res = await this.pool.query(`SELECT * FROM submissions WHERE pending = false`);
        return res.rows.map(row => JSON.parse(JSON.stringify(row)));
    }

    public async startSubmissionForUser(submission: GameClubManager.Submission) {
        const query = 'INSERT INTO submissions(date, id, info, gameid, pending) VALUES($1, $2, $3, $4, $5)';
        const values = [submission.date, submission.id, submission.info, submission.gameid, true];
        await this.pool.query(query, values);
    }

    public async completeSubmissionForUser(igdbId: string, userId: string) {
        const query = `UPDATE submissions SET gameid = $1, pending = false WHERE id = $2 AND pending = true`;
        await this.pool.query(query, [igdbId, userId]);
    }

    public async removePendingSubmissionsForUser(userId: string): Promise<void> {
        const query = `DELETE FROM submissions WHERE id = $1 AND pending = true`;
        await this.pool.query(query, [userId]);
    }

}