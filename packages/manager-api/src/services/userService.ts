const DiscordOauth2 = require('discord-oauth2');
import { GameClubManager } from '@game-club-manager/manager-model';
import { getRequiredEnvVar } from '../util/getRequiredEnvVar';

export type OAuthToken = {
    access_token: string;
}
export class UserService {

    constructor(
        private oauth = new DiscordOauth2({
            clientId: getRequiredEnvVar('DISCORD_CLIENT_ID'),
            clientSecret: getRequiredEnvVar('DISCORD_CLIENT_SECRET'),
            redirectUri: getRequiredEnvVar('DISCORD_CALLBACK_URL'),
          })
    ){}

    public generateAuthURL(state: string): string {
        return this.oauth.generateAuthUrl({
            scope: 'identify',
            state: `${state}`});
    }

    public async requestAccessToken(code: string): Promise<OAuthToken> {
        console.log('UserService: requestAccessToken')
        const token = await this.oauth.tokenRequest({
            code: code,
            grantType: 'authorization_code'
          }) as OAuthToken;
        console.log(token);
        return token;
    }

    public async getUser(accessToken: string): Promise<GameClubManager.User> {
        const user = await this.oauth.getUser(accessToken);
        return user as GameClubManager.User;
    } 
}