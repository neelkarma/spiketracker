from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session

matches = Blueprint("/matches", __name__)


@matches.put("/")
def create_match():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "Forbidden", 403

    data = request.get_json()

    con = get_db()
    con.execute(
        "INSERT INTO matches (teamId, oppName, time, location, points, visible, scoring) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (
            data["teamId"],
            data["oppName"],
            data["time"],
            data["location"],
            data["points"],
            data["visible"],
            data["scoring"],
        ),
    )
    con.commit()
    con.close()

    return jsonify({"success": True}), 200


@matches.get("/<id>")
def get_match(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    con = get_db()
    data = con.execute("SELECT * FROM matches WHERE id = ?", (id,)).fetchone()
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
            "scoring": data["scoring"],
        }
    )


@matches.post("/<id>")
def edit_match(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "Forbidden", 403

    data = request.get_json()

    cur = get_db()
    cur.execute(
        "UPDATE matches SET teamId = ?, oppName = ?, time = ?, location = ?, points = ?, visible = ?, scoring = ? WHERE id = ?",
        (
            data["ourTeamId"],
            data["oppTeamName"],
            data["date"],
            data["location"],
            data["points"],
            data["visible"],
            data["scoring"],
        ),
    )
    cur.commit()
    cur.close()

    return jsonify({"success": True}), 200


@matches.delete("/<id>")
def delete_match(id: int):
    session = get_session()

    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "Forbidden", 403

    con = get_db()
    con.execute("DELETE FROM matches WHERE id = ?", (id,))

    return jsonify({"success": True}), 200
