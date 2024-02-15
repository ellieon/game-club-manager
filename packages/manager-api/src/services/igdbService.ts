import { IGDB } from 'igdb-ts';
import { getRequiredEnvVar } from '../util/getRequiredEnvVar';
import { Cover, CoverFields, DefaultIGDBOptions, Game, GameFields, ImageOptions, Screenshot, ScreenshotFields, SearchableIGDBOptions } from 'igdb-ts/dist/types';

type Token = {
    token: string
    tokenExpiry: number
}
let accessToken: Token | undefined = undefined

const onAccessTokenRetrieved = (token: string, tokenExpiry: number) => {
    console.log("caching token " + token);
	accessToken = { token, tokenExpiry }
}

export class IGDBService {
    constructor(
        private igdb = new IGDB()
    ) {

    }

    public async searchCoverForGameTitle(title: string): Promise<Cover> {
        const games = await this.searchGame(title);
        const cover = await this.getCover(games[0].id.toString());
        return cover;
    }

    public async getScrenshotsForGame(game: Game): Promise<Screenshot[]> {
        await this.init();
        const options: DefaultIGDBOptions<Screenshot> = {
            limit: 3,
            filter: {
                filters: [
                    {field: ScreenshotFields.GAME, postfix: "=", value: game.id}
                ],
            }
        }
        return await this.igdb.getScreenshots(options);
    }

    public async searchGame(title: string): Promise<Game[]>{
        await this.init();
        return await this.igdb.getGames({ search: title });
    }

    public async getGame(id: string) : Promise<Game> { 
        await this.init();
        const options: DefaultIGDBOptions<Game> = {
            filter: {
                filters: [
                    {field: GameFields.ID, postfix: "=", value: id}
                ],
            }
        }

        return (await this.igdb.getGames(options))[0];
    }
    
    public async getCover(gameId: string): Promise<Cover> {
        await this.init();
        const options: DefaultIGDBOptions<Cover> = {
            exclude: ["game"],
            filter: {
                filters: [
                    {field: CoverFields.GAME, postfix: "=", value: gameId}
                ],
            }
        }
        return (await this.igdb.getCovers(options))[0];
    }

    public async getImage(id: string): Promise<string> {
        await this.init();
        const options: ImageOptions = {
            imageId: id,
            size:  "cover_big",
            retina: true,
        }
        
        return await this.igdb.getImageUrl(options);
    }

    public async getScreenshotImage(id: string): Promise<string> {
        await this.init();
        const options: ImageOptions = {
            imageId: id,
            size:  "screenshot_big",
            retina: true,
        }
        
        return await this.igdb.getImageUrl(options);
    }

    private async init() {
        await this.igdb.init(getRequiredEnvVar('TWITCH_CLIENT_ID'), getRequiredEnvVar('TWITCH_SECRET'), accessToken, onAccessTokenRetrieved)
    }
}