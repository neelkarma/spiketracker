from db import get_db
from flask import Blueprint, jsonify, request
from routers.player import (
    calculate_player_stat_success_rate,
    calculate_player_total_points,
    get_player_match_ids,
    get_player_teams,
)
from session import get_session

players = Blueprint("players", __name__, url_prefix="/players")


@players.get("/")
def get_players():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    query = request.args.get("q", "")
    sort_by = request.args.get("sort", "surname")
    reverse = request.args.get("reverse", "0") == "1"

    con = get_db()

    sql = """
        SELECT *
        FROM players
        WHERE
            firstName || ' ' || surname LIKE ?
            OR id = ?
    """

    players = con.execute(
        sql,
        ("%" + query + "%", int(query) if query.isdecimal() else -1),
    ).fetchall()

    if not session["admin"]:
        players = filter(lambda row: row["visible"] == 1, players)

    processed_players = []
    for player in players:
        matchIds = get_player_match_ids(player["id"], con)
        teams = get_player_teams(player["id"], con)
        totalPoints = calculate_player_total_points(player["id"], con)
        ppg = totalPoints / len(matchIds) if len(matchIds) > 0 else 0
        kr = calculate_player_stat_success_rate(player["id"], "attack", con)
        pef = calculate_player_stat_success_rate(player["id"], "set", con)

        processed_players.append(
            {
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
                "visible": bool(player["visible"]),
            }
        )

    processed_players.sort(
        key=lambda row: row[sort_by].lower()
        if isinstance(row[sort_by], str)
        else row[sort_by],
        reverse=reverse,
    )

    con.close()

    return jsonify(processed_players), 200
