from flask import Blueprint

from backend.db import get_db
from backend.session import get_session

players = Blueprint("players", __name__)


@players.get("/me")
def me():
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    
    if session["admin"]:
        return "You are an admin", 400

    con = get_db()
    con.execute(
        "SELECT first_name, last_name FROM players WHERE id = ?", (session["id"],)
    )

@players.delete("/<id>")
def delete_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    
    if not session["admin"]:
        return "You a student", 401
    
    con = get_db()
    con.execute(
        "DELETE FROM players WHERE id = ?", (id,)
    )

    return "Success", 200

