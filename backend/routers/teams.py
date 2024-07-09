from sqlite3 import DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from routers.team import (
    calculate_team_stat_success_rate,
    calculate_team_wins_losses_set_ratio,
)
from session import get_session

teams = Blueprint("teams", __name__, url_prefix="/teams")


@teams.get("/")
def get_teams():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    query = request.args.get("q", "")
    sort_by = request.args.get("sort", "name")
    reverse = request.args.get("reverse", "0") == "1"
    player_id = request.args.get("player_id", "-1")

    con = get_db()

    try:
        sql = """
            SELECT DISTINCT teams.*
            FROM teams
            INNER JOIN teamPlayers ON teamPlayers.teamId = teams.id
            WHERE
                teams.name LIKE ?
                OR teams.id = ?
                OR teamPlayers.playerId = ?
        """

        teams = con.execute(
            sql,
            (
                "%" + query + "%",
                int(query) if query.isdecimal() else -1,
                int(player_id) if player_id.isdecimal() else -1,
            ),
        ).fetchall()

        if not session["admin"]:
            teams = filter(lambda row: row["visible"] == 1, teams)

        processed_teams = []
        for team in teams:
            kr = calculate_team_stat_success_rate(team["id"], "atk", con)
            pef = calculate_team_stat_success_rate(team["id"], "set", con)
            wins, losses, set_ratio = calculate_team_wins_losses_set_ratio(
                team["id"], con
            )

            player_ids = con.execute(
                "SELECT playerId FROM teamPlayers WHERE teamId = ?", (team["id"],)
            ).fetchall()
            player_ids = [row["playerId"] for row in player_ids]

            processed_teams.append(
                {
                    "id": team["id"],
                    "name": team["name"],
                    "wins": wins,
                    "losses": losses,
                    "setRatio": set_ratio,
                    "kr": kr,
                    "pef": pef,
                    "playerIds": player_ids,
                    "year": team["year"],
                    "visible": bool(team["visible"]),
                }
            )

        processed_teams.sort(
            key=lambda row: row[sort_by].lower()
            if isinstance(row[sort_by], str)
            else row[sort_by],
            reverse=reverse,
        )

        con.close()

        return jsonify(processed_teams), 200
    except (DatabaseError, KeyError) as e:
        print(e, flush=True)
        con.close()

        return "Invalid Input", 400
