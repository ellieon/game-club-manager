import { Pool } from 'pg'
import { getRequiredEnvVar } from '../util/getRequiredEnvVar';
import { GuildSelection } from '../types/selection';
import { Submission } from '../types/submission';

export class DatabaseService {
    constructor(private pool: Pool = new Pool({connectionString: getRequiredEnvVar('DATABASE_URL')})){
    }

    public async addSubmission(submission: Submission) {
        const query = 'INSERT INTO submissions(date, "user", info, gameid, pending, guild) VALUES($1, $2, $3, $4, $5, $6)';
        const values = [submission.date, submission.user, submission.info, submission.gameid, false, submission.guild];
        await this.pool.query(query, values);
    }

    public async getSubmissionsForGuildFromDate(date: Date,  guildId: string): Promise<Submission[]> {
        const isoDate = date.toISOString();
        const res = await this.pool.query(`SELECT * FROM submissions WHERE pending = false AND guild = $1 AND date > $2`, [guildId, isoDate]);
        //TODO: Could do with some actual data mappers here
        return res.rows.map(row => JSON.parse(JSON.stringify(row)));
    }

    public async getSubmissionsForGuild(guildId: string): Promise<Submission[]> {
        const res = await this.pool.query(`SELECT * FROM submissions WHERE pending = false AND guild = $1`, [guildId]);
        //TODO: Could do with some actual data mappers here
        return res.rows.map(row => JSON.parse(JSON.stringify(row)));
    }

    public async getSubmissionsForUserFromDate(date: Date,  userId: string, guildId: string): Promise<Submission[]> {
        const isoDate = date.toISOString();
        const res = await this.pool.query(`SELECT * FROM submissions WHERE pending = false AND "user" = $1 AND date > $2 AND guild = $3 ORDER BY "date" DESC`, [userId, isoDate, guildId]);
        //TODO: Could do with some actual data mappers here
        return res.rows.map(row => JSON.parse(JSON.stringify(row)));
    }

    public async getSubmissionsForUser( userId: string, guildId: string): Promise<Submission[]> {
        const res = await this.pool.query(`SELECT * FROM submissions WHERE pending = false AND "user" = $1 AND guild = $2 ORDER BY "date" DESC`, [userId, guildId]);
        //TODO: Could do with some actual data mappers here
        return res.rows.map(row => JSON.parse(JSON.stringify(row)));
    }

    public async startSubmissionForUser(submission: Submission) {
        const query = 'INSERT INTO submissions(date, "user", info, gameid, pending, guild) VALUES($1, $2, $3, $4, $5, $6)';
        const values = [submission.date, submission.user, submission.info, submission.gameid, true, submission.guild];
        await this.pool.query(query, values);
    }

    public async completeSubmissionForUser(igdbId: string, userId: string) {
        const query = `UPDATE submissions SET gameid = $1, pending = false WHERE "user" = $2 AND pending = true`;
        await this.pool.query(query, [igdbId, userId]);
    }

    public async removePendingSubmissionsForUser(userId: string, guild: string): Promise<void> {
        const query = `DELETE FROM submissions WHERE "user" = $1 AND pending = true AND guild = $2` ;
        await this.pool.query(query, [userId, guild]);
    }

    public async removeAllSubmissionsForUser(userId: string, guild: string): Promise<void> {
        const query = `DELETE FROM submissions WHERE "user" = $1 AND guild = $2 AND pending = false` ;
        await this.pool.query(query, [userId, guild]);
    }

    public async removeAllSubmissionsForUserFromDate(date: Date, userId: string, guild: string): Promise<void> {
        const query = `DELETE FROM submissions WHERE "user" = $1 AND guild = $2 AND "date" > $3 AND pending = false` ;
        await this.pool.query(query, [userId, guild, date.toISOString()]);
    }

    public async getLastSelection(guild: string): Promise<GuildSelection | undefined> {
        const query = 'SELECT selections."date" AS "date", selections.guild FROM selections WHERE selections.guild = $1 ORDER BY selections."date" DESC'
        const response = await this.pool.query(query, [guild]);
        if (response.rowCount && response.rowCount > 0) {
            return JSON.parse(JSON.stringify(response.rows[0])) as GuildSelection;
        }
        return undefined
    }

    public async createSelection(submission: Submission): Promise<void> {
        const query = 'INSERT INTO selections ("date", guild, selectionId) VALUES ($1, $2, $3)';
        await this.pool.query(query, [new Date().toISOString(), submission.guild, submission.id])
    }

}