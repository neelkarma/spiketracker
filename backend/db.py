import sqlite3

con = sqlite3.connect("data.sqlite3")
con.row_factory = sqlite3.Row
with open("schema.sql") as f:
    con.executescript(f.read())


def get_db():
    return con.cursor()
