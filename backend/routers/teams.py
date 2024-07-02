from sqlite3 import Connection, DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from routers.team import (
    calculate_team_stat_success_rate,
    calculate_team_wins_losses_set_ratio,
)
from session import get_session

teams = Blueprint("teams", __name__, url_prefix="/teams")


def transform_row(team: dict, con: Connection):
    kr = calculate_team_stat_success_rate(team["id"], "attack", con)
    pef = calculate_team_stat_success_rate(team["id"], "set", con)
    wins, losses, set_ratio = calculate_team_wins_losses_set_ratio(team["id"], con)

    player_ids = con.execute(
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
        "visible": bool(team["visible"]),
    }


@teams.get("/")
def get_teams():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    query = request.args.get("q", "")
    sort_by = request.args.get("sort", "name")
    reverse = request.args.get("reverse", "0") == "1"

    con = get_db()

    try:
        sql = """
            SELECT *
            FROM teams
            WHERE name LIKE ? OR id = ?
        """

        teams = con.execute(
            sql,
            ("%" + query + "%", int(query) if query.isdecimal() else -1),
        ).fetchall()

        if not session["admin"]:
            teams = filter(lambda row: row["visible"] == 1, teams)

        teams = [transform_row(row, con) for row in teams]
        teams.sort(key=lambda row: row[sort_by], reverse=reverse)

        con.close()

        return jsonify(teams), 200
    except (DatabaseError, KeyError):
        con.close()

        return "Invalid Input", 400