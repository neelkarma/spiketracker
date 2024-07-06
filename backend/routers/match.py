import json
from sqlite3 import DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session

match = Blueprint("match", __name__, url_prefix="/match")


@match.get("/<id>")
def get_match(id_str: str):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    id = None
    try:
        id = int(id_str)
    except ValueError:
        return "id must be an integer", 400

    con = get_db()
    match_data = con.execute("SELECT * FROM matches WHERE id = ?", (id,)).fetchone()

    if match_data is None:
        con.close()
        return "Not Found", 404

    if match_data["visible"] != 1 and not session["admin"]:
        con.close()
        return "Forbidden", 403

    sql = """
        SELECT name
        FROM teams
        INNER JOIN matches ON teams.id = matches.teamId
        WHERE matches.id = ?;
    """
    teamName = con.execute(sql, (id,)).fetchone()["name"]

    con.close()

    return jsonify(
        {
            "id": match_data["id"],
            "ourTeamId": match_data["teamId"],
            "ourTeamName": teamName,
            "oppTeamName:": match_data["oppName"],
            "location": match_data["location"],
            "time": match_data["time"],
            "points": json.loads(match_data["points"]),
            "visible": bool(match_data["visible"]),
            "scoring": bool(match_data["scoring"]),
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
    con = get_db()

    try:
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
        con.commit()
        con.close()

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        con.rollback()
        con.close()

        return jsonify({"success": False}), 400


@match.put("/<id>")
def edit_match(id_str: str):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    id = None
    try:
        id = int(id_str)
    except ValueError:
        return "id must be an integer", 400

    data = request.get_json()

    con = get_db()

    try:
        sql = """
            UPDATE matches
            SET teamId = ?, oppName = ?, time = ?, location = ?, points = ?, visible = ?, scoring = ?
            WHERE id = ?
        """

        con.execute(
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

        con.commit()
        con.close()

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        con.rollback()
        con.close()

        return jsonify({"success": False}), 400


@match.delete("/<id>")
def delete_match(id_str: str):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    id = None
    try:
        id = int(id_str)
    except ValueError:
        return "id must be an integer", 400

    con = get_db()
    con.execute("DELETE FROM matches WHERE id = ?", (id,))
    con.commit()
    con.close()

    return jsonify({"success": True}), 200
