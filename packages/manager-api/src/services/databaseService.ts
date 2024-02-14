import { Pool } from 'pg'
import { getRequiredEnvVar } from '../util/getRequiredEnvVar';
import { GameClubManager } from '@game-club-manager/manager-model';

export class DatabaseService {
    constructor(private pool: Pool = new Pool({connectionString: getRequiredEnvVar('DATABASE_URL')})){
    }

    public async addSubmission(submission: GameClubManager.Submission) {
        const query = 'INSERT INTO submissions(submission_date, user_id, submission_info) VALUES($1, $2, $3)';
        const values = [submission.date, submission.userId, submission.info];
        await this.pool.query(query, values);
    }
}