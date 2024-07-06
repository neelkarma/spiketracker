from sqlite3 import Connection, DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from routers.teams import calculate_team_stat_success_rate
from session import get_session

player = Blueprint("player", __name__, url_prefix="/player")


def calculate_player_stat_success_rate(id: int, action: str, con: Connection):
    sql = """
        SELECT rating, count(*) AS count
        FROM stats
        WHERE action = ? AND playerId = ?
        GROUP BY rating;
    """

    ratings = con.execute(sql, (action, id)).fetchall()
    num_total = 0
    num_successful = 0

    for row in ratings:
        num_total += row["count"]
        if row["rating"] == 3:
            num_successful += row["count"]

    return num_successful / num_total if num_total > 0 else 0


def get_player_teams(id: int, con: Connection):
    sql = """
        SELECT teams.id, teams.name
        FROM teams
        INNER JOIN teamPlayers ON teams.id = teamPlayers.teamId
        WHERE teamPlayers.playerId = ?;
    """
    teams = con.execute(sql, (id,)).fetchall()
    return [dict(team) for team in teams]


def calculate_player_total_points(id: int, con: Connection):
    sql = """
        SELECT count(*) AS count
        FROM stats
        WHERE
            action = 'attack'
            AND rating = 3
            AND playerId = ?;
    """
    totalPoints = con.execute(sql, (id,)).fetchone()["count"]
    return totalPoints


def get_player_match_ids(id: int, con: Connection):
    sql = """
        SELECT matches.id
        FROM matches
        INNER JOIN teamPlayers ON matches.teamId = teamPlayers.teamId
        WHERE teamPlayers.playerId = ?;
    """
    matchIds = con.execute(sql, (id,)).fetchall()
    matchIds = [row["id"] for row in matchIds]
    return matchIds


@player.get("/<id>")
def get_player(id_str: str):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    id = None
    try:
        id = int(id_str)
    except ValueError:
        return "id must be an integer", 400

    con = get_db()
    player_data = con.execute("SELECT * FROM players WHERE id = ?", (id,)).fetchone()

    if player_data is None:
        con.close()
        return "Not Found", 404

    if player_data["visible"] != 1 and not session["admin"]:
        con.close()
        return "Forbidden", 403

    teams = get_player_teams(id, con)
    totalPoints = calculate_player_total_points(id, con)
    matchIds = get_player_match_ids(id, con)
    ppg = totalPoints / len(matchIds) if len(matchIds) > 0 else 0
    kr = calculate_team_stat_success_rate(id, "attack", con)
    pef = calculate_team_stat_success_rate(id, "set", con)

    con.close()

    return jsonify(
        {
            "id": id,
            "firstName": player_data["firstName"],
            "surname": player_data["surname"],
            "gradYear": player_data["gradYear"],
            "teams": teams,
            "ppg": ppg,
            "kr": kr,
            "pef": pef,
            "matchIds": matchIds,
            "totalPoints": totalPoints,
            "visible": bool(player_data["visible"]),
        }
    )


@player.get("/<id>/matches")
def get_player_matches(id_str: str):
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
            matches.teamId as ourTeamId, 
            teams.name as ourTeamName,
            matches.oppName as oppTeamName,
            matches.location,
            matches.time,
            matches.points,
            matches.visible,
            matches.scoring
        FROM matches
        INNER JOIN teams ON teams.id = matches.teamId
        INNER JOIN teamPlayers ON teamPlayers.teamId = matches.teamId
        WHERE teamPlayers.playerId = ?;
    """

    matches = con.execute(sql, (id,)).fetchall()

    processed_matches = []
    for row in matches:
        sql = """
            SELECT rating, count(*) AS count
            FROM stats
            WHERE
                playerId = ?
                AND matchId = ?
                AND action = ?
            GROUP BY rating
        """

        attack_ratings = con.execute(sql, (id, row["id"], "attack")).fetchall()
        total_attacks = 0
        successful_attacks = 0
        for atkrow in attack_ratings:
            total_attacks += atkrow["count"]
            if atkrow["rating"] == 3:
                successful_attacks += atkrow["count"]

        kr = successful_attacks / total_attacks if total_attacks > 0 else 0

        pass_ratings = con.execute(sql, (id, row["id"], "set")).fetchall()
        total_passes = 0
        successful_passes = 0
        for passrow in pass_ratings:
            total_attacks += passrow["count"]
            if passrow["rating"] == 3:
                successful_attacks += passrow["count"]

        pef = successful_passes / total_passes if total_passes > 0 else 0

        processed_matches.append(
            {"match": dict(row), "kr": kr, "pef": pef, "points": successful_attacks}
        )

    return jsonify(processed_matches), 200


@player.post("/")
def create_player():
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    body = request.get_json()
    con = get_db()

    try:
        sql = """
            INSERT INTO players (id, firstName, surname, gradYear, visible)
            VALUES (?, ?, ?, ?, ?)
        """
        con.execute(
            sql,
            (
                body["id"],
                body["firstName"],
                body["surname"],
                body["gradYear"],
                body["visible"],
            ),
        )

        sql = """
            INSERT INTO teamPlayers (playerId, teamId)
            VALUES (?, ?)
        """
        con.executemany(sql, [(body["id"], team["id"]) for team in body["teams"]])

        con.commit()
        con.close()

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        con.rollback()
        con.close()

        return jsonify({"success": False}), 400


@player.put("/<id>")
def edit_player(id_str: str):
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

    body = request.get_json()
    con = get_db()

    try:
        sql = """
            UPDATE players
            SET firstName = ?, surname = ?, gradYear = ?, visible = ?
            WHERE id = ?
        """
        con.execute(
            sql,
            (body["firstName"], body["surname"], body["gradYear"], body["visible"], id),
        )
        con.commit()
        con.close()

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        con.rollback()
        con.close()

        return jsonify({"success": False}), 400


@player.delete("/<id>")
def delete_player(id_str: str):
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
    con.execute("DELETE FROM players WHERE id = ?", (id,))
    con.execute("DELETE FROM teamPlayers WHERE playerId = ?", (id,))
    con.commit()
    con.close()

    return jsonify({"success": True}), 200
