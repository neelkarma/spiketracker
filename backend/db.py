import sqlite3

_is_cold = True


def get_db():
    global _is_cold

    con = sqlite3.connect("data.sqlite3")

    # this makes sqlite output rows as dicts and not lists, so they're easier to use
    con.row_factory = sqlite3.Row

    # on first run, we want to instantiate the database schema
    if _is_cold:
        with open("schema.sql") as f:
            con.executescript(f.read())

        # this prevents the schema from being re-run on subsequent calls
        _is_cold = False

    return con
