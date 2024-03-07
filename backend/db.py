import sqlite3

_is_cold = True


def get_db():
    global _is_cold

    con = sqlite3.connect("data.sqlite3")
    con.row_factory = sqlite3.Row

    if _is_cold: # to instantiate
        with open("schema.sql") as f:
            con.executescript(f.read())
        _is_cold = False

    return con

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv