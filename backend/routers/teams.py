from sqlite3 import Cursor, DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session
from routers.team import (
    calculate_team_stat_success_rate,
    calculate_team_wins_losses_set_ratio,
)

teams = Blueprint("/teams", __name__)


def transform_row(team: dict, cur: Cursor):
    kr = calculate_team_stat_success_rate(team["id"], "attack", cur)
    pef = calculate_team_stat_success_rate(team["id"], "set", cur)
    wins, losses, set_ratio = calculate_team_wins_losses_set_ratio(team["id"], cur)

    player_ids = cur.execute(
        "SELECT playerId FROM teamPlayers WHERE teamId = ?", (id,)
    ).fetchall()
    player_ids = [row["playerId"] for row in player_ids]

    return {
        "id": team["id"],
        "name": team["name"],
        "wins": wins,
        "losses": losses,
        "setRatio": set_ratio,
        "kr": kr,
        "pef": pef,
        "playerIds": player_ids,
        "visible": team["visible"],
    }


@teams.get("/")
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
            FROM teams
            WHERE name LIKE ? OR id = ?
            ORDER BY ? ?
        """

        teams = cur.execute(
            sql,
            (
                "%" + query + "%",
                int(query) if query.isdecimal() else -1,
                sort_by,
                "DESC" if reverse else "ASC",
            ),
        ).fetchall()

        teams = [transform_row(row, cur) for row in teams]

        return jsonify(teams), 200
    except (DatabaseError, KeyError):
        return "Invalid Input", 400
