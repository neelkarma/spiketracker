import json
from sqlite3 import Connection, DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session

team = Blueprint("team", __name__, url_prefix="/team")


def calculate_team_stat_success_rate(id: int, action: str, con: Connection):
    sql = """
        SELECT stats.rating, count(*) AS count
        FROM stats
        INNER JOIN matches ON matches.id = stats.matchId
        WHERE stats.action = ? AND matches.teamId = ?
        GROUP BY stats.rating;
    """

    ratings = con.execute(sql, (action, id)).fetchall()
    num_total = 0
    num_successful = 0

    for row in ratings:
        num_total += row["count"]
        if row["rating"] == 3:
            num_successful += row["count"]

    return num_successful / num_total if num_total > 0 else 0


def calculate_team_wins_losses_set_ratio(id: int, con: Connection):
    match_points = con.execute(
        "SELECT points FROM matches WHERE teamId = ?", (id,)
    ).fetchall()

    wins = 0
    losses = 0
    set_wins = 0
    set_losses = 0

    for points in match_points:
        points = json.loads(points["points"])

        match_set_wins = 0
        match_set_losses = 0

        for set_points in points:
            if set_points["our"] > set_points["opp"] and set_points["our"] >= 15:
                match_set_wins += 1
            elif set_points["our"] < set_points["opp"] and set_points["opp"] >= 15:
                match_set_losses += 1

        if match_set_wins > match_set_losses:
            wins += 1
        elif match_set_losses > match_set_wins:
            losses += 1

        set_wins += match_set_wins
        set_losses += match_set_losses

    set_ratio = 0
    # protect against division by zero
    if set_losses != 0:
        set_ratio = set_wins / set_losses

    return wins, losses, set_ratio


@team.get("/<id_str>")
def get_team(id_str: str):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    id = None
    try:
        id = int(id_str)
    except ValueError:
        return "id must be an integer", 400

    con = get_db()

    team_data = con.execute("SELECT * FROM teams WHERE id = ?", (id,)).fetchone()

    if team_data is None:
        con.close()
        return "Not Found", 404

    if team_data["visible"] != 1 and not session["admin"]:
        con.close()
        return "Forbidden", 404

    player_ids = con.execute(
        "SELECT playerId FROM teamPlayers WHERE teamId = ?", (id,)
    ).fetchall()
    player_ids = [row["playerId"] for row in player_ids]

    wins, losses, set_ratio = calculate_team_wins_losses_set_ratio(id, con)
    kr = calculate_team_stat_success_rate(id, "attack", con)
    pef = calculate_team_stat_success_rate(id, "set", con)

    con.close()

    return jsonify(
        {
            "id": id,
            "name": team_data["name"],
            "wins": wins,
            "losses": losses,
            "setRatio": set_ratio,
            "kr": kr,
            "pef": pef,
            "playerIds": player_ids,
            "year": team_data["year"],
            "visible": bool(team_data["visible"]),
        }
    ), 200


@team.get("/<id_str>/players")
def get_team_players(id_str: str):
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
        WHERE teamPlayers.teamId = ?
    """

    players = con.execute(sql, (id,))
    processed_players = []

    for player in players:
        sql = """
            SELECT rating, count(*) AS count FROM stats
            INNER JOIN matches ON matches.id = stats.matchId
            WHERE
                matches.teamId = ?
                AND stats.playerId = ?
                AND stats.action = ?
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

        sql = """
            SELECT count(*) AS count FROM matches
            WHERE matches.teamId = ?
        """
        total_matches = con.execute(sql, (id,)).fetchone()["count"]

        ppg = successful_attacks / total_matches if total_matches > 0 else 0

        processed_players.append(
            {**player, "kr": kr, "pef": pef, "ppg": ppg, "points": successful_attacks}
        )

    return jsonify(processed_players), 200


@team.post("/")
def create_team():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "Forbidden", 403

    body = request.get_json()
    con = get_db()

    try:
        sql = """
            INSERT INTO teams (name, year, visible)
            VALUES (?, ?, ?)
        """

        con.execute(sql, (body["name"], body["year"], body["visible"]))

        team_id = con.execute("SELECT max(id) AS id FROM teams").fetchone()["id"]

        sql = """
            INSERT INTO teamPlayers (teamId, playerId)
            VALUES (?, ?)
        """
        con.executemany(sql, [(team_id, player_id) for player_id in body["playerIds"]])

        con.commit()
        con.close()

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError) as e:
        print(e, flush=True)
        con.rollback()
        con.close()

        return jsonify({"success": False}), 400


@team.delete("/<id_str>")
def delete_team(id_str: str):
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
    con.execute("DELETE FROM teamPlayers WHERE teamId = ?", (id,))
    con.execute("DELETE FROM teams WHERE id = ?", (id,))
    con.commit()
    con.close()

    return jsonify({"success": True}), 200


@team.put("/<id_str>")
def edit_team(id_str: int):
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
            UPDATE teams
            SET name = ?, year = ?, visible = ?
            WHERE id = ?
        """

        con.execute(sql, (body["name"], body["year"], body["visible"], id))

        con.execute("DELETE FROM teamPlayers WHERE teamId = ?", (id,))
        sql = """
            INSERT INTO teamPlayers (teamId, playerId)
            VALUES (?, ?)
        """
        con.executemany(sql, [(id, playerId) for playerId in body["playerIds"]])

        con.commit()
        con.close()

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError):
        con.rollback()
        con.close()

        return jsonify({"success": False}), 400
