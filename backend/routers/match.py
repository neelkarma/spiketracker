import json
from sqlite3 import DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session

match = Blueprint("match", __name__, url_prefix="/match")


@match.get("/<id>")
def get_match(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    con = get_db()
    match_data = con.execute("SELECT * FROM matches WHERE id = ?", (id,)).fetchone()
    if match_data is None:
        return "Not Found", 404

    sql = """
        SELECT name
        FROM teams
        INNER JOIN matches ON teams.id = matches.teamId
        WHERE matches.id = ?;
    """
    teamName = con.execute(sql, (id,)).fetchone()["name"]

    return jsonify(
        {
            "id": match_data["id"],
            "ourTeamId": match_data["teamId"],
            "ourTeamName": teamName,
            "oppTeamName:": match_data["oppName"],
            "location": match_data["location"],
            "time": match_data["time"],
            "points": json.loads(match_data["points"]),
            "visible": match_data["visible"],
            "scoring": match_data["scoring"],
        }
    ), 200


@match.post("/")
def create_match():
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    data = request.get_json()

    try:
        con = get_db()

        sql = """
            INSERT INTO matches (teamId, oppName, time, location, points, visible, scoring)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """

        con.execute(
            sql,
            (
                data["ourTeamId"],
                data["oppTeamName"],
                data["time"],
                data["location"],
                data["points"],
                data["visible"],
                data["scoring"],
            ),
        )

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        return jsonify({"success": False}), 400


@match.put("/<id>")
def edit_match(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    data = request.get_json()

    try:
        cur = get_db()

        sql = """
            UPDATE matches
            SET teamId = ?, oppName = ?, time = ?, location = ?, points = ?, visible = ?, scoring = ?
            WHERE id = ?
        """

        cur.execute(
            sql,
            (
                data["ourTeamId"],
                data["oppTeamName"],
                data["date"],
                data["location"],
                json.dumps(data["points"]),
                data["visible"],
                data["scoring"],
                id,
            ),
        )
        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        return jsonify({"success": False}), 400


@match.delete("/<id>")
def delete_match(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    con = get_db()
    con.execute("DELETE FROM matches WHERE id = ?", (id,))

    return jsonify({"success": True}), 200
