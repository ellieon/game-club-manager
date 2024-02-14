# game-club-manager

## About
This is a mono-repo (using lerna) containing the entirety of the game club manager server software. The individual packages in the 'packages' directory are as follows:
* `manager-api` - The main server software, containing the RESTful API for submitting and retreving data
* `manager-database` - Manages database seeding and migrations
* `manager-model` - Shared data models across all packages

## Development
### Prerequisites
* A discord developer account, with an app setup, you will need the client ID and client secret for the app
* Docker to run the local database
* node.js and npm, (I use 20.11.0, but it shouldn't be too picky)
* Lerna `npm install -g lerna`

### Setup
* A docker compose file has been provided to setup the local database, start it by running `docker-compose up`
* install all dependenices from the root with `npm install`
* dotenv is used for environment variables, in the `manager-api` and `manager-database` packages, copy the `.env.example` file to `.env` in the root of each of these, default variables have been provided but variables for the discord API will need to be filled in both of these files
* Run `db:create` to create and seed the database tables
* run `start:dev` to start the local development environment, the app will then be available at `localhost:3000` by default.
* The entry point for the main server is located in `packages/manager-api/src/index`

## Deployment
* A Procfile for deployment on Heroku has been provided, you will need an app with at least 1 dyno, and an attached PostgreSQL database, it is super janky to get it working with the monorepo, but it works for now. Note you will have to run the following in your heroku cli for the database to work: `heroku config:set PGSSLMODE=no-verify -a <your-app-name>`



