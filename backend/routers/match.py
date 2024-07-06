import json
from sqlite3 import DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session

match = Blueprint("match", __name__, url_prefix="/match")


@match.get("/<id_str>")
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

    sql = """
        SELECT
            matches.id,
            matches.teamId,
            teams.name AS ourTeamName,
            matches.oppName AS oppTeamName,
            matches.location,
            matches.time,
            matches.points,
            matches.visible,
            matches.scoring
        FROM matches
        INNER JOIN teams ON teams.id = matches.teamId
        WHERE matches.id = ?
    """
    match_data = con.execute(sql, (id,)).fetchone()

    if match_data is None:
        con.close()
        return "Not Found", 404

    if match_data["visible"] != 1 and not session["admin"]:
        con.close()
        return "Forbidden", 403

    con.close()

    return jsonify(
        {
            **match_data,
            "points": json.loads(match_data["points"]),
            "visible": bool(match_data["visible"]),
            "scoring": bool(match_data["scoring"]),
        }
    ), 200


@match.get("/<id_str>/players")
def get_match_players(id_str: str):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    id = None
    try:
        id = int(id_str)
    except ValueError:
        return "id must be an integer", 400

    con = get_db()
    sql = """
        SELECT * FROM players
        INNER JOIN teamPlayers ON teamPlayers.playerId = players.id
        INNER JOIN matches ON matches.teamId = teamPlayers.teamId
        WHERE matches.id = ?
    """
    players = con.execute(sql, (id,)).fetchall()

    processed_players = []
    for player in players:
        sql = """
            SELECT rating, count(*) AS count FROM stats
            WHERE
                matchId = ?
                AND playerId = ?
                AND action = ?
            GROUP BY rating
        """

        attack_ratings = con.execute(sql, (id, player["id"], "attack")).fetchall()
        total_attacks = 0
        successful_attacks = 0
        for atkrow in attack_ratings:
            total_attacks += atkrow["count"]
            if atkrow["rating"] == 3:
                successful_attacks += atkrow["count"]

        kr = successful_attacks / total_attacks if total_attacks > 0 else 0

        pass_ratings = con.execute(sql, (id, player["id"], "set")).fetchall()
        total_passes = 0
        successful_passes = 0
        for passrow in pass_ratings:
            total_attacks += passrow["count"]
            if passrow["rating"] == 3:
                successful_attacks += passrow["count"]

        pef = successful_passes / total_passes if total_passes > 0 else 0

        processed_players.append(
            {"player": dict(player), "kr": kr, "pef": pef, "points": successful_attacks}
        )

    return jsonify(processed_players), 200


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


@match.put("/<id_str>")
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


@match.delete("/<id_str>")
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
