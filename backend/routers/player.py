from sqlite3 import Cursor, DatabaseError
from db import get_db
from flask import Blueprint, jsonify, request
from routers.teams import calculate_team_stat_success_rate
from session import get_session

player = Blueprint("/player", __name__)


def calculate_player_stat_success_rate(id: int, action: str, cur: Cursor):
    sql = """
        SELECT rating, count(*) AS count
        FROM stats
        WHERE action = ? AND playerId = ?
        GROUP BY rating;
    """

    ratings = cur.execute(sql, (action, id)).fetchall()
    num_total = 0
    num_successful = 0

    for row in ratings:
        num_total += row["count"]
        if row["rating"] == 3:
            num_successful += row["count"]

    return num_successful / num_total


def get_player_teams(id: int, cur: Cursor):
    sql = """
        SELECT teams.id, teams.name
        FROM teams
        INNER JOIN teamPlayers ON teams.id = teamPlayers.teamId
        WHERE teamPlayers.playerId = ?;
    """
    teams = cur.execute(sql, (id,)).fetchall()
    return teams


def calculate_player_total_points(id: int, cur: Cursor):
    sql = """
        SELECT count(*) AS count
        FROM stats
        WHERE
            action = 'attack'
            AND rating = 3
            AND playerId = ?;
    """
    totalPoints = cur.execute(sql, (id,)).fetchone()["count"]
    return totalPoints


def get_player_match_ids(id: int, cur: Cursor):
    sql = """
        SELECT matches.id
        FROM matches
        INNER JOIN teamPlayers ON matches.teamId = teamPlayers.teamId
        WHERE teamPlayers.playerId = ?;
    """
    matchIds = cur.execute(sql, (id,)).fetchall()
    matchIds = [row["id"] for row in matchIds]
    return matchIds


@player.get("/<id>")
def get_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    cur = get_db()
    player_data = cur.execute("SELECT * FROM players WHERE id = ?", (id,)).fetchone()

    if player_data is None:
        return "Not Found", 404

    teams = get_player_teams(id, cur)
    totalPoints = calculate_player_total_points(id, cur)
    matchIds = get_player_match_ids(id, cur)

    ppg = totalPoints / len(matchIds)

    kr = calculate_team_stat_success_rate(id, "attack", cur)
    pef = calculate_team_stat_success_rate(id, "set", cur)

    cur.close()

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
            "visible": player_data["visible"],
        }
    )

@player.get("/<id>/matches")
def get_player_matches(id: int):
    def transform_row(row: dict, cur: Cursor):
        sql = """
            SELECT rating, count(*) AS count
            FROM stats
            WHERE
                playerId = ?
                AND matchId = ?
                AND action = ?
            GROUP BY rating
        """

        attack_ratings = cur.execute(sql, (id, row["id"], "attack")).fetchall()
        total_attacks = 0
        successful_attacks = 0
        for atkrow in attack_ratings:
            total_attacks += atkrow["count"]
            if atkrow["rating"] == 3:
                successful_attacks += atkrow["count"]

        kr = successful_attacks / total_attacks

        pass_ratings = cur.execute(sql, (id, row["id"], "set")).fetchall()
        total_passes = 0
        successful_passes = 0
        for passrow in pass_ratings:
            total_attacks += passrow["count"]
            if passrow["rating"] == 3:
                successful_attacks += passrow["count"]

        pef = successful_passes / total_passes

        return {
            "match": row,
            "kr": kr,
            "pef": pef,
            "points": successful_attacks
        }

    session = get_session()
    if session is None:
        return "Unauthorized", 401
    
    cur = get_db()

    sql = """
        SELECT * FROM matches
        INNER JOIN teamPlayers ON teamPlayers.teamId = matches.teamId
        WHERE teamPlayers.playerId = ?;
    """

    matches = cur.execute(sql, (id,)).fetchall()
    matches = [transform_row(row, cur) for row in matches]
    
    return jsonify(matches), 200


@player.post("/")
def create_player():
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    body = request.get_json()

    try:
        cur = get_db()
        sql = """
            INSERT INTO players (firstName, surname, gradYear, visible)
            VALUES (?, ?, ?, ?, ?)
        """

        cur.execute(
            sql, (body["firstName"], body["surname"], body["gradYear"], body["visible"])
        )

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        return jsonify({"success": False}), 400


@player.put("/<id>")
def edit_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    body = request.get_json()

    try:
        cur = get_db()

        sql = """
            UPDATE players
            SET firstName = ?, surname = ?, gradYear = ?, visible = ?
            WHERE id = ?
        """
        cur.execute(
            sql, (body["firstName"], body["surname"], body["gradYear"], body["visible"])
        )

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        return jsonify({"success": False}), 400


@player.delete("/<id>")
def delete_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "Forbidden", 403

    cur = get_db()
    cur.execute("DELETE FROM players WHERE id = ?", (id,))

    return jsonify({"success": True}), 200
