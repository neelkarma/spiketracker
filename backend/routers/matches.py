import json

import jsonify
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

@matches.get("/<id>")
def get_match_data(id: int):
    cur = get_db()
    data = cur.execute("SELECT * FROM matches WHERE id = ?", (id,)).fetchone()
    if data is None:
        return "Not Found", 404
    
    # TODO: incomplete
    
    jsonify(
        {
            "id": data["id"],
            "ourTeamId": data["ourTeamId"],
            "ourTeamName": data["ourTeamName"],
            "oppTeamName:": data["oppTeamName"],
            "location": data["location"],
            "date": data["date"],
            "pointsOverriden": data["pointsOverriden"],
            "points": data["points"],
            "visible": data["visible"],
            "scoring": data["scoring"]
        }
    )
