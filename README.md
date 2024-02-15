# game-club-manager

## About
The Game Club Manager is a simple Discord Bot for managing a "Game Club" on a discord server, allowing people to submit games with brief discriptions via Discord modal forms, and the random drawing of game being handled by the same bot (With some IGDB integration to pull information about the games that are submit). 

This is a mono-repo (using lerna) containing the entirety of the game club manager discord bot software. The individual packages in the 'packages' directory are as follows:

* `manager-database` - Manages database seeding and migrations
* `manager-bot` - All of the code for running the actual bot itself

## Development
### Prerequisites
* A discord developer account, with an application setup, you will need the bot secret token (and to invite the bot to a server to test)
* A twitch developer account with an application setup, you will need the client id and token from here for IGDB integration
* Docker to run the local database
* node.js and npm, (I use 20.11.0, but it shouldn't be too picky)
* Lerna `npm install -g lerna`

### Setup
* A docker compose file has been provided to setup the local database, start it by running `docker-compose up`
* install all dependenices from the root with `npm install`
* dotenv is used for environment variables, in the `manager-bot` and `manager-database` packages, copy the `.env.example` file to `.env` in the root of each of these, default variables have been provided but variables for the discord and IGDB APIs will need to be filled in both of these files
* run `start:bot` to start the local development environment, this will run the database migrations and start the actual bot software itself under nodemon.

### Command Propagation
Once a bot has been run for the first time, it can take up to an hour for discord to fully propagate what slash commands are available so you can see them. A way around this for development purposes is to set the commands for a specific guild, the following environment variables will allow you to automatically do this on startup  
* `UPDATE_GUILD_COMMANDS`: Setting this to any value will have the bot start guild command registration on startup
* `GUILD_CLIENT_ID`: The client ID of your discord application, this will be the same application that has your bot secret token
* `GUILD_ID`: The discord id of the server you do your testing in (You can get this by right clicking the server name and selecting `copy server ID` )

## Deployment
* A Procfile for deployment on Heroku has been provided, you will need an app with at least 1 worker dyno, and an attached PostgreSQL database. Note you will have to run the following in your heroku cli for the database to work: `heroku config:set PGSSLMODE=no-verify -a <your-app-name>`



