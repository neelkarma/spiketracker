# SpikeTracker

> Volleyball stat tracking software for SBHS.

## Setting Up

1. Make sure you have installed the following software:

- VS Code
- Git
- NodeJS
- pnpm

2. Clone this repo. (`git clone https://github.com/neelkarma/spiketracker`)
3. Open the new folder in VS Code and start a new terminal.
4. Create a `.env` file with the following:

```
CLIENT_SECRET=(sbhs client secret - ask neel for this)
CLIENT_ID=(sbhs client id - ask neel for this)
SESSION_SECRET=(32 random characters - you can keyboard mash this)
ADMIN_PASSWORD=(the admin's password. set this to whatever you want)
BASE_URL=http://localhost:5173
DB_PATH=data.sqlite3
DB_AUTH_TOKEN=
```

5. Run `pnpm i` to install all the required dependencies.
6. Run `pnpm initdb` to initialize the local database.

## Start Developing

1. Open the project in VS Code and create a new terminal.
2. Run `pnpm dev` to start the development server.

## Common Issues

### Getting a backend error whenever the database is instantiated

Check if the database schema is valid by installing SQLite, opening a new
terminal and typing

```sh
sqlite3 < schema.sql
```

In most cases, this will give you a hint as to where the problem is in the
schema. If there's no problem in the schema, gg.

### Manually interacting with the database

Use a tool like SQLiteBrowser to open the `data.sqlite3` file, which has all the
data of the app.

## Helpful Resources

- [Bulma Docs](https://bulma.io/documentation) - Documentation for the CSS
  (Styling) framework we're using
- [Svelte Website](https://svelte.dev) - Docs, tutorials, and examples on using
  Svelte (the UI framework we're using)
- [SvelteKit Website](https://kit.svelte.dev) - Docs, tutorials, and examples on
  using SvelteKit (the web framework we're using)
- [LibSQL Docs](https://docs.turso.tech/sdk/ts/reference) - Docs for LibSQL, the
  SQLite database library we're using
- [Observable Plot](https://observablehq.com/plot/getting-started) - Docs for
  Observable Plot, the plotting library we're using for the heatmap
