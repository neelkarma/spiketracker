# SpikeTracker

> Volleyball stat tracking software for SBHS.

## Dev Guide

### Setting Up

1. Make sure you have installed the following software:

- VS Code
- Git
- NodeJS
- pnpm
- Python

2. Clone this repo. (`git clone https://github.com/neelkarma/spiketracker`)
3. Open the new folder in VS Code and start a new terminal.
4. Create a `.env.dev` file in the `backend` folder with the following:

```
FLASK_CLIENT_SECRET=(sbhs client secret - ask neel for this)
FLASK_CLIENT_ID=(sbhs client id - ask neel for this)
FLASK_SESSION_SECRET=(32 random characters - you can keyboard mash this)
FLASK_ADMIN_PASSWORD=(the admin's password. set this to whatever you want)
FLASK_DB_PATH=data.sqlite3
FLASK_ORIGIN=localhost
FLASK_BACKEND_BASE=http://localhost:5000
FLASK_BACKEND_BASE=http://localhost:5173
```

### Start Developing

1. Open the project in VS Code and create a new terminal.
2. `cd backend`
3. If this is your first time, run `pip install -r requirements.txt`.
4. `flask run --debug` - This starts the backend server.
5. Create another terminal.
6. `cd frontend`
7. If this is your first time, run `pnpm i`
8. `pnpm dev --open` - This starts the frontend server and opens the website on
   your browser.

### Manually interacting with the database

Use a tool like SQLiteBrowser to open the `data.sqlite3` file, which has all the
data of the app.
