from sqlite3 import Cursor, DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session
from routers.player import (
    calculate_player_stat_success_rate,
    calculate_player_total_points,
    get_player_match_ids,
    get_player_teams,
)

players = Blueprint("/players", __name__)


def transform_row(player: dict, cur: Cursor):
    matchIds = get_player_match_ids(player["id"], cur)
    teams = get_player_teams(player["id"], cur)
    totalPoints = calculate_player_total_points(player["id"], cur)
    ppg = totalPoints / len(matchIds)
    kr = calculate_player_stat_success_rate(player["id"], "attack", cur)
    pef = calculate_player_stat_success_rate(player["id"], "set", cur)

    return {
        "id": player["id"],
        "firstName": player["firstName"],
        "surname": player["surname"],
        "gradYear": player["gradYear"],
        "teams": teams,
        "matchIds": matchIds,
        "ppg": ppg,
        "kr": kr,
        "pef": pef,
        "totalPoints": totalPoints,
        "visible": player["visible"],
    }


@players.get("/")
def get_teams():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    query = request.args.get("q", "")
    sort_by = request.args.get("sort", "name")
    reverse = request.args.get("reverse", "0") == "1"

    try:
        cur = get_db()

        sql = """
            SELECT *
            FROM players
            WHERE
                concat(firstName, ' ', surname) LIKE ?
                OR id = ?
            ORDER BY ? ?
        """

        players = cur.execute(
            sql,
            (
                "%" + query + "%",
                int(query) if query.isdecimal() else -1,
                sort_by,
                "DESC" if reverse else "ASC",
            ),
        ).fetchall()

        players = [transform_row(row, cur) for row in players]

        return jsonify(players), 200
    except (DatabaseError, KeyError):
        return "Invalid Input", 400
