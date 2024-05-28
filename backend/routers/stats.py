from db import get_db

# from flask import Blueprint, jsonify
from flask import Blueprint, jsonify, request

stats = Blueprint("/stats", __name__)


@stats.get("/")
def query_stats_bulk():
    match_id = request.args.get("match_id")
    team_id = request.args.get("team_id")
    player_id = request.args.get("player_id")

    if match_id is None and team_id is None and player_id is None:
        return "No params given", 400

    if match_id is not None:
        if match_id.isdigit():
            match_id = int(match_id)
        else:
            return "match_id must be an integer", 400
    if team_id is not None:
        if team_id.isdigit():
            team_id = int(team_id)
        else:
            return "team_id must be an integer", 400
    if player_id is not None:
        if player_id.isdigit():
            player_id = int(player_id)
        else:
            return "player_id must be an integer", 400

    cur = get_db()
    data = cur.execute(
        "SELECT * FROM stats INNER JOIN matches ON stats.match_id = matches.id INNER JOIN players ON stats.player_id = players.id WHERE (? = 1 OR stats.match_id = ?) AND (? = 1 OR matches.team_id = ?) AND (? = 1 OR stats.player_id = ?)",
        (
            int(match_id is None),
            match_id,
            int(team_id is None),
            team_id,
            int(player_id is None),
            player_id,
        ),
    ).fetchall()

    return jsonify([dict(row) for row in data]), 200


@stats.post("/<match_id>")
def edit_match_stats(match_id: int):
    data = request.get_json()

    # TODO: complete this
