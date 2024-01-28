# SpikeTracker

> Volleyball stat tracking software for SBHS.

## Dev Guide

### Setting Up

1. Make sure you have installed the following software:

- VS Code
- Git
- NodeJS
- pnpm
- Docker

2. Clone this repo. (`git clone https://github.com/neelkarma/spiketracker`)
3. Open the new folder in VS Code and start a new terminal.
4. Create a `.env` file with the following:

```
CLIENT_SECRET=(sbhs client secret - ask neel for this)
CLIENT_ID=(sbhs client id - ask neel for this)
SESSION_SECRET=(32 random characters - you can keyboard mash this)
ADMIN_PASSWORD=(the admin's password. set this to whatever you want)
PG_PASSWORD=(the database password. set this to whatever you want)
PG_USER=postgres
PG_DATABASE=postgres
PG_DATA_DIR=(the folder where db data is stored. if unsure, use ./db)
```

4. Run `docker compose build db` in the terminal.

### Start Developing

1. Open the project in VS Code and create a new terminal.
2. Run `docker compose up db`. This starts the local database.
3. Create another terminal and run `pnpm dev`. This starts the web server.

### Manually interacting with the database

1. Open the project in VS Code and create a new terminal
2. Run `docker compose up db`. This starts the local database.
3. Create another terminal and run `pnpm db studio`. This starts a database
   explorer web app, which you can use to add records and test queries.
