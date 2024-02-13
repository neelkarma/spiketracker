import sqlite3

con = None


def get_db():
    if con is None:
        con = sqlite3.connect("data.sqlite3")
        con.row_factory = sqlite3.Row
        with open("schema.sql") as f:
            con.executescript(f.read())

    return con
