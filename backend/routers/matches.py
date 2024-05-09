import json
from flask import Blueprint

from backend.db import get_db

matches = Blueprint("/matches", __name__)

@matches.delete("/<id>")
def delete_match(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "You a student", 401

    con = get_db()
    con.execute("DELETE FROM matches WHERE id = ?", (id,))

    return "Success", 200

con.execute("SELECT points from matches WHERE id = ?", (id,))

points_str = cursor.fetchall()
point_dict = json.loads(points_str)
