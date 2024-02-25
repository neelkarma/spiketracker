from flask import Blueprint

from backend.db import get_db
from backend.session import get_session

players = Blueprint("players", __name__)


@players.get("/me")
def me():
    session = get_session()
    if session is None:
        return "Unauthorised", 401
    elif session["admin"]:
        return "You are an admin", 400
    else:
        return "You are a student", 400


    con = get_db()
    con.execute(
        "SELECT first_name, last_name FROM players WHERE id = ?", (session["id"],)
    )
    
